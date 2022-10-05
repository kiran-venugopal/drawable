import { configureStore, createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { uuidv4 } from '~/utils/account';
import filesSlice, { FilesStateType } from './filesSlice';

export type ActiveUserType = {
  name: string;
  color: string;
  id: string;
};

export type AccountDataType = {
  isLoggedIn: boolean;
  user: {
    name?: string;
    color?: string;
    id?: string;
    files?: string[];
  };
  tempId: string;
  activeUsers: ActiveUserType[];
};

const initialAccountState: AccountDataType = {
  isLoggedIn: false,
  user: {},
  tempId: uuidv4(),
  activeUsers: [],
};

const accountSlice = createSlice({
  name: 'account',
  initialState: initialAccountState,
  reducers: {
    setAccount(state, { payload }: { payload: Partial<AccountDataType> }) {
      return { ...state, ...payload };
    },
    setActiveUsers(state, { payload }) {
      return {
        ...state,
        activeUsers: payload.filter((user: User) => user.id !== state.tempId),
      };
    },
  },
});

export const accountActions = accountSlice.actions;
export const filesActions = filesSlice.actions;

const reducerObj = {
  account: accountSlice.reducer,
  files: filesSlice.reducer,
};

export type ReducersType = {
  account: AccountDataType;
  files: FilesStateType;
};

const store = configureStore({
  reducer: reducerObj,
});

export default store;
