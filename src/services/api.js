// src/services/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://3.36.43.89:3000/',
  headers: {
    'Content-Type': 'application/json',
  }
});


// Employee
export const fetchEmployeesFromCompany = (companyId) => {
  return instance.get(`/company/${companyId}`);
};

export const addEmployeeToCompany = (companyId, employeeData) => {
  return instance.post('/user/add', employeeData);
};

export const updateEmployeeDetails = (employeeData) => {
  // Assuming an endpoint to update an employee looks like this:
  console.log(`upDATE user ${employeeData.user_id}`, employeeData);
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
  return instance.get('/home');
};

export const uploadCSVData = (csvData, onProgress) => {
  return instance.post('/api/upload', csvData, {
    headers: {
      'Content-Type': 'text/csv'
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) {
        onProgress(percentCompleted);  // Invoke the callback
      }
    }
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Server error');
      } else {
        throw new Error('Network error');
      }
    });
};