// src/slices/loginSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  user: null,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginStarted: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { loginStarted, loginSuccess, loginFailed } = loginSlice.actions;

export default loginSlice.reducer;
