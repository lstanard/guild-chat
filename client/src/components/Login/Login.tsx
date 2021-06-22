import React, { useCallback, useState, ReactElement } from 'react';

import useAuth from '../../useAuth';
import messages from '../../messages';

const Login = (): ReactElement => {
  const { login, error: loginError } = useAuth();
  /**
   * Made these inputs controlled so there could eventually be some
   * validation, but not going to worry about that right now.
   */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(() => {
    login({ username, password });
  }, [login, username, password]);

  return (
    <div>
      <h2>Log in</h2>
      <label htmlFor="login-username">Username</label>
      <input
        type="text"
        id="login-username"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <label htmlFor="login-password">Password</label>
      <input
        type="password"
        id="login-password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="button" onClick={handleLogin}>
        Submit
      </button>
      {loginError && (
        <p style={{ color: 'tomato' }}>{messages.en.LoginError}</p>
      )}
    </div>
  );
};

export default Login;
