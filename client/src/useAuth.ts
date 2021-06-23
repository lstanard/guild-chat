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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Attempt to get user from store
   */
  const { user } = useAppSelector((state) => state.authentication);

  useLayoutEffect(() => {
    setIsAuthenticated(!!user?.id);
  }, [user]);

  /**
   * Log user in
   * @param name
   * @param pass
   */
  const login = useCallback(
    async ({ username, password }: UserCredentials) => {
      if (username && password) {
        const authAction = await dispatch(
          authenticateUser({ username, password })
        );
        if (!authAction?.payload) {
          setError(true);
        }
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
