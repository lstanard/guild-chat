# Guild Chat

## General Notes

- Recommend node `v12` or `v14`
- Make sure the server is running before starting the client otherwise the socket connection may not be established

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

# Client

Start the React client on port `3000`:

- `cd client`
- `yarn install`
- `yarn start`

### Client Testing

- `yarn test-cy` (need to have client and server running)

# Server

Start the Express server on port `8000`:

- `cd server`
- `yarn install`
- `yarn start`

# Things I would have done with all the time in world:

- Enable chat between more than 2 users
