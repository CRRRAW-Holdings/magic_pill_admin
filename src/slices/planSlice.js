// planSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlansFromApi } from '../services/api';

// Async thunk to fetch plans
export const fetchPlans = createAsyncThunk(
  'plan/fetchPlans',
  async () => {
    const response = await fetchPlansFromApi();
    return response.data.results;
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
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = 'There was an issue loading the plans. Please try again later.';
      });
  }
});

export default planSlice.reducer;

export const { setHasError, setErrorMessage } = planSlice.actions;
