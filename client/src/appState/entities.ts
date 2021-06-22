import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../appState/store';
import { USERS_URL, MESSAGES_URL } from '../constants';
import { UserEntity, MessageEntity } from '../../appTypes';

interface UserEntities {
  [key: string]: UserEntity;
}

interface EntitiesState {
  users: UserEntities;
  messages: MessageEntity[];
}

const initialState: EntitiesState = {
  users: {},
  messages: []
};

export const fetchUsers = createAsyncThunk(
  'entities/users/fetchUsers',
  async () => {
    const response = await fetch(USERS_URL);
    if (response.ok) {
      let result = await response.json();
      return result.users;
    } else {
      return null;
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'entities/messages/fetchMessages',
  async () => {
    const response = await fetch(MESSAGES_URL);
    if (response.ok) {
      let result = await response.json();
      return result.messages;
    } else {
      return null;
    }
  }
);

export const entities = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    updateMessages: (state, action: PayloadAction<MessageEntity[]>) => {
      state.messages = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const users: UserEntities = {};
        action.payload.forEach((user: UserEntity) => {
          users[user.id] = user;
        });
        state.users = users;
      })
      .addCase(
        fetchMessages.fulfilled,
        (state, action: PayloadAction<MessageEntity[]>) => {
          state.messages = action.payload;
        }
      );
  }
});

export const { updateMessages } = entities.actions;

/**
 * Get all users except the current authenticated user
 *
 * @param state Top level store state
 */
export const getUserFriends = (state: RootState): UserEntity[] => {
  const { user: authenticatedUser } = state.authentication;
  return Object.values(state.entities.users).filter((user) => {
    return user.id !== authenticatedUser?.id;
  });
};

export default entities.reducer;
