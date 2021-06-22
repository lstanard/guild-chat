import React, { ReactElement } from 'react';
import { useAppSelector } from '../../appState/hooks';

import useAuth from '../../useAuth';

const Header = (): ReactElement => {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useAppSelector((state) => state.authentication);

  return (
    <header className="app-header">
      <h1>Guild Chat</h1>
      {isAuthenticated && (
        <div>
          <p>
            Welcome, {user?.fullName}!{' '}
            <button
              type="button"
              onClick={() => logout()}
              style={{ marginLeft: '1rem' }}
            >
              Log out
            </button>
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;
