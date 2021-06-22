import { configureStore } from '@reduxjs/toolkit';

import authentication from './auth';
import entities from './entities';

const store = configureStore({
  reducer: {
    authentication,
    entities
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
