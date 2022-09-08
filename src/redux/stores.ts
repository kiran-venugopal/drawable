import { configureStore, createSlice } from '@reduxjs/toolkit';
import { uuidv4 } from '~/utils/account';

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
  name: 'counter',
  initialState: initialAccountState,
  reducers: {
    setAccount(state, { payload }: { payload: Partial<AccountDataType> }) {
      return { ...state, ...payload };
    },
    addActiveUser(state, { payload }: { payload: any[] }) {
      return {
        ...state,
        activeUsers: state.activeUsers.concat(payload.filter((user) => user.id !== state.tempId)),
      };
    },
    removeActiveUser(state, { payload }) {
      const ids = payload.map((u: any) => u.id);
      console.log(ids);
      return {
        ...state,
        activeUsers: state.activeUsers.filter((user) => !ids.includes(user.id)),
      };
    },
  },
});

export const accountActions = accountSlice.actions;

const store = configureStore({
  reducer: accountSlice.reducer,
});

export default store;
