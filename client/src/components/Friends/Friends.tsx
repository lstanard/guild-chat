import React, { useEffect, ReactElement } from 'react';

import { useAppDispatch, useAppSelector } from '../../appState/hooks';
import { fetchUsers, getUserFriends } from '../../appState/entities';
import messages from '../../messages';

export interface FriendsProps {
  className?: string;
}

const Friends = ({ className }: FriendsProps): ReactElement => {
  const dispatch = useAppDispatch();
  const friends = useAppSelector(getUserFriends);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <aside className={className} data-cy="friends-panel">
      <h3>{messages.en.FriendsListHeader}</h3>
      {friends?.length ? (
        <ul>
          {friends.map((friend) => {
            return (
              <li key={friend.id}>
                <span>{friend.fullName}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You have 0 friends</p>
      )}
    </aside>
  );
};

export default Friends;
