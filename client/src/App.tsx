import React, { ReactElement } from 'react';
import socketClient from 'socket.io-client';

import './App.css';

import useAuth from './useAuth';
import { SERVER_URL } from './constants';
import { Login, Header, Friends, Messages } from './components';

/**
 * Establish socket.io connection
 */
const socket = socketClient(SERVER_URL);
socket.on('connection', () => {
  console.log('Socket connection established');
});

function App(): ReactElement {
  const { isAuthenticated } = useAuth();
  let content;

  if (!isAuthenticated) {
    content = <Login />;
  } else {
    content = (
      <main className="main">
        <Friends className="friends-panel" />
        <Messages className="messages-panel" socket={socket} />
      </main>
    );
  }

  return (
    <div className="app">
      <Header />
      {content}
    </div>
  );
}

export default App;
