import { configureStore, createSlice } from '@reduxjs/toolkit';

export type AccountDataType = {
  isLoggedIn: boolean;
  user: {
    name?: string;
    color?: string;
  };
};

const initialAccountState: AccountDataType = {
  isLoggedIn: false,
  user: {},
};

const accountSlice = createSlice({
  name: 'counter',
  initialState: initialAccountState,
  reducers: {
    setAccount(state, { payload }: { payload: AccountDataType }) {
      return { ...state, ...payload };
    },
  },
});

export const actions = accountSlice.actions;

const store = configureStore({
  reducer: accountSlice.reducer,
});

export default store;
