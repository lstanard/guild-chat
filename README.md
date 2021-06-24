# Guild Chat

Simple real-time chat application.

## General Notes

- Recommend node `v12` or higher
- Make sure the server is running **before** starting the client otherwise the socket connection may not be established

## Logging In

There are 2 test users that can be used to log in with and send/receive messages:

**User 1**

```
username: user1
password: test
```

**User 2**

```
username: user2
password: test
```

# Server

Start the Express server on port `8000`:

- `cd server`
- `yarn install`
- `yarn start`

# Client

Start the React client on port `3000`:

- `cd client`
- `yarn install`
- `yarn start`

### Client Testing

- `yarn test-cy` (need to have client and server running)

# Things I would do with more time:

- Store user credentials or a token in localStorage so you don't have to log in again after page refresh
- Loading indicator when fetching data (friends list, messages)
- Use TypeScript for the `server`
- Watch for changes to `server` so I don't have to kill/restart the server with every change
- Write test for sending a message and verifying the other user receives it
