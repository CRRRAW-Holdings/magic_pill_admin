// companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCompaniesFromApi } from '../services/api';

// Async thunk to fetch companies
export const fetchCompanies = createAsyncThunk(
  'company/fetchCompanies',
  async () => {
    const response = await fetchCompaniesFromApi();
    return response.data.results;
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
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
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = action.error.message || 'There was an issue loading the companies. Please try again later.';
      });      
  }
});

export default companySlice.reducer;

export const { setSearchTerm, setHasError, setErrorMessage } = companySlice.actions;
