import React, { useEffect, ReactElement } from 'react';

import { useAppDispatch, useAppSelector } from '../../appState/hooks';
import { fetchUsers, getUserFriends } from '../../appState/entities';

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
    <div className={className}>
      <h3>Friends List</h3>
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
    </div>
  );
};

export default Friends;
