// src/services/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Landing
export const fetchAdminByEmail = (email) => {
  return instance.get(`/admins/email/${email}`);
};

// Employee
export const fetchEmployeesFromCompany = (companyId) => {
  return instance.get(`/company/${companyId}`);
};

export const addEmployeeToCompany = (companyId, employeeData) => {
  return instance.post('/user/add', employeeData);
};

export const updateEmployeeDetails = (employeeData) => {
  // Assuming an endpoint to update an employee looks like this:
  return instance.post(`/user/update/${employeeData.user_id}`, employeeData);
};

export const toggleEmployeeStatus = (employeeId) => {
  // Assuming an endpoint to toggle an employee's status looks like this:
  return instance.post(`/user/toggle/${employeeId}`);
};

// Auth
export const loginUser = (username, password) => {
  return instance.post('/login', { username, password });
};

// Company
export const fetchCompaniesFromApi = () => {
  return instance.get('/company');
};

export const fetchPlansFromApi = () => {
  return instance.get('/plans');
};

export const uploadCSVData = (csvData, onProgress) => {
  console.log(csvData,'apiCSVDATA');
  return instance.post('/user/bulk', csvData, {
    headers: {
      'Content-Type': 'application/json'
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) {
        onProgress(percentCompleted);
      }
    }
  })
    .then((response) => {
      return response.data?.users || [];
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Server error');
      } else {
        throw new Error('Network error');
      }
    });
};