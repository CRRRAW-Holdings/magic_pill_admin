// companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAdminByEmail } from '../services/api';

// Async thunk to fetch admin details by email
export const fetchAdminDetails = createAsyncThunk(
  'admin/fetchAdminDetails',
  async (email) => {
    const response = await fetchAdminByEmail(email);
    return response;
  }
);

const companySlice = createSlice({
  name: 'admin',
  initialState: {
    currentAdmin: null,
    searchTerm: '',
    hasError: false,
    errorMessage: '',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setHasError: (state, action) => {
      state.hasError = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDetails.fulfilled, (state, action) => {
        state.currentAdmin = action.payload;
      })
      .addCase(fetchAdminDetails.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = action.error.message || 'There was an issue loading the admin details. Please try again later.';
      });      
  }
});

export default companySlice.reducer;

export const { setSearchTerm, setHasError, setErrorMessage } = companySlice.actions;
