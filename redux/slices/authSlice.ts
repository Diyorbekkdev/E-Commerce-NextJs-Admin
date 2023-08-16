import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import { TOKEN } from "@/constants";
import { User } from '@/types';
 
interface StateTypes {
  isAuth: boolean;
  user: User | null;
}

const initialState: StateTypes = {
  isAuth: getCookie(TOKEN) ? true : false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => {
      state.isAuth = true;
    },
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
    },
  },
  extraReducers: {},
});

export const { name } = authSlice;

export const { setAuth, setUser } = authSlice.actions;

export default authSlice.reducer;
