import { configureStore } from "@reduxjs/toolkit";
import authReducer, { name as authName } from "../slices/authSlice";

export const store = configureStore({
  reducer: {
    [authName]: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;