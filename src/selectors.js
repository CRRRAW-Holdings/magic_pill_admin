// src/selectors.js

//AUTH/USER
export const selectAdminData = state => state.auth.currentAdmin;

//COMPANY
export const selectSearchTerm = state => state.company.searchTerm;

export const selectHasError = state => state.company.hasError;

export const selectErrorMessage = state => state.company.errorMessage;

export const selectCurrentAdmin = state => state.company.currentAdmin;


