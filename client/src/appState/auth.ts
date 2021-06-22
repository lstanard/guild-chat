import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { AUTH_URL } from '../constants';
import { UserEntity, UserCredentials } from '../../appTypes';

interface AuthState {
  user: null | UserEntity;
  authError: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: false
};

export const authenticateUser = createAsyncThunk(
  'authentication/login',
  async (userCredentials: UserCredentials) => {
    const { username, password } = userCredentials;
    let response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) {
      let result = await response.json();
      return result as UserEntity;
    } else {
      return null;
    }
  }
);

export const authentication = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<null | UserEntity>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      authenticateUser.fulfilled,
      (state, action: PayloadAction<null | UserEntity>) => {
        if (action.payload) {
          state.authError = false;
          state.user = action.payload;
        } else {
          state.authError = true;
        }
      }
    );
  }
});

export const { setUser } = authentication.actions;

export default authentication.reducer;
