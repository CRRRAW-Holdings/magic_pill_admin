import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../services/api';  // Make sure to import your loginUser function
import _ from 'lodash';

const initialState = {
  loading: false,
  user: null,
  error: null,
};

export const attemptLogin = createAsyncThunk(
  'login/attemptLogin',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await loginUser(username, password);
      if (_.get(response, 'data.success')) {
        return response.data.user;
      } else {
        return thunkAPI.rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(attemptLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(attemptLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(attemptLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default loginSlice.reducer;
