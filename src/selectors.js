// src/selectors.js

import { createSelector } from 'reselect';


//AUTH/USER
export const selectAdminData = state => state.auth.admin;

//COMPANY
export const selectCompanies = state => state.company.companies;

export const selectSearchTerm = state => state.company.searchTerm;

export const selectHasError = state => state.company.hasError;

export const selectErrorMessage = state => state.company.errorMessage;

// Example of creating a memoized selector using reselect
// Assuming adminData and companies are frequently accessed together
export const selectFilteredCompanies = createSelector(
  [selectAdminData, selectCompanies, selectSearchTerm],
  (adminData, companies, searchTerm) => {
    let adminCompanyIds = [];
    if (adminData && adminData.company_id) {
      adminCompanyIds = adminData.company_id.split(',').map(id => parseInt(id));
    }

    return companies.filter(company =>
      company.insurance_company_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      adminCompanyIds.includes(company.insurance_company_id)
    );
  }
);


