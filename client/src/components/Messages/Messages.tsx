import React, {
  ReactElement,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react';
import cn from 'classnames';
import { Socket } from 'socket.io-client';

import { fetchMessages, updateMessages } from '../../appState/entities';
import { useAppDispatch, useAppSelector } from '../../appState/hooks';

export interface MessagesProps {
  socket: Socket;
  className?: string;
}

const Messages = ({ socket, className }: MessagesProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) =>
    Object.values(state.entities.messages)
  );
  const { user: authenticatedUser } = useAppSelector(
    (state) => state.authentication
  );
  const { users } = useAppSelector((state) => state.entities);

  /**
   * Fetch any existing messages from the server.
   */
  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  /**
   * For the sake of time I'm making this chat only work between 2 users –
   * the authenticated user and then the other app user. In an ideal scenario
   * there would be some application state that tracks the current active chat
   * to allow for chatting with multiple users.
   */
  const otherUser = useMemo(() => {
    return Object.values(users).find(
      (user) => user.id !== authenticatedUser?.id
    );
  }, [users, authenticatedUser]);

  const sendMessage = useCallback(() => {
    const input = inputRef.current;
    if (input?.value) {
      socket.emit('send-message', {
        id: `${Date.now()}`,
        sender: authenticatedUser?.id,
        recipient: otherUser?.id,
        text: input.value
      });
    }
    if (inputRef?.current) {
      inputRef.current.value = '';
    }
  }, [socket, otherUser, authenticatedUser]);

  useEffect(() => {
    socket.on('messages-stream', (messages) => {
      dispatch(updateMessages(messages));
    });
  }, [socket, dispatch]);

  return (
    <div className={className} data-cy="messages-panel">
      <div>
        <h3>Chat with {otherUser?.fullName}</h3>
        {messages.length ? (
          <ul className="message-list">
            {messages.map((message) => (
              <li
                key={message.id}
                className={cn('message', {
                  'message-self': message.sender === authenticatedUser?.id
                })}
              >
                <span>From: {users[message.sender]?.fullName}</span>
                <p>{message.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages</p>
        )}
      </div>
      <div>
        <input type="text" ref={inputRef} data-cy="message-input" />
        <button type="button" onClick={sendMessage}>
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Messages;
