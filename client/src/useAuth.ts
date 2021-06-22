import { useState, useCallback, useLayoutEffect } from 'react';

import { UserCredentials } from '../appTypes';
import { authenticateUser, setUser } from './appState/auth';
import { useAppSelector, useAppDispatch } from './appState/hooks';

export interface UserAuth {
  isAuthenticated: boolean;
  error: boolean;
  login(userCredentials: UserCredentials): void;
  logout(): void;
}

export default function useAuth(): UserAuth {
  const dispatch = useAppDispatch();

  /**
   * Attempt to get user from store
   */
  const { user, authError } = useAppSelector((state) => state.authentication);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(authError || false);

  useLayoutEffect(() => {
    setIsAuthenticated(!!user?.id);
  }, [user]);

  useLayoutEffect(() => {
    setError(authError);
  }, [authError]);

  /**
   * Log user in
   * @param name
   * @param pass
   */
  const login = useCallback(
    async ({ username, password }: UserCredentials) => {
      if (username && password) {
        setError(false);
        dispatch(authenticateUser({ username, password }));
      } else {
        setError(true);
      }
    },
    [dispatch]
  );

  /**
   * Log user out
   */
  const logout = useCallback(() => {
    dispatch(setUser(null));
  }, [dispatch]);

  return {
    isAuthenticated,
    error,
    login,
    logout
  };
}
