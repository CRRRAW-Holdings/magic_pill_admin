// planSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlans } from '../services/api';

// Async thunk to fetch plans
export const fetchPlansThunk = createAsyncThunk(
  'plan/fetchPlans',
  async () => {
    const response = await fetchPlans();
    return response;
  }
);

const planSlice = createSlice({
  name: 'plan',
  initialState: {
    plans: [],
    hasError: false,
    errorMessage: '',
  },
  reducers: {
    setHasError: (state, action) => {
      state.hasError = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlansThunk.fulfilled, (state, action) => {
        state.plans = action.payload;
      })
      .addCase(fetchPlansThunk.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = 'There was an issue loading the plans. Please try again later.';
      });
  }  
});

export default planSlice.reducer;

export const { setHasError, setErrorMessage } = planSlice.actions;
