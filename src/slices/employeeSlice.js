import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import {
  fetchEmployeesFromCompany, addEmployeeToCompany, updateEmployeeDetails, toggleEmployeeStatus,
  uploadCSVData,
  approveEmployeeChanges
} from '../services/api';

export const fetchEmployees = createAsyncThunk(
  'employee/fetchByCompanyId',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await fetchEmployeesFromCompany(companyId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : 'Network error. Please try again.');
    }
  }
);

export const addEmployeeThunk = createAsyncThunk(
  'employee/addEmployee',
  async ({ employeeData }) => {
    const newEmployee = await addEmployeeToCompany(employeeData);
    return newEmployee;
  }
);

// Async thunk to update an employee
export const updateEmployeeThunk = createAsyncThunk(
  'employee/updateEmployee',
  async ({ documentId, employeeData }) => {
    const updatedEmployee = await updateEmployeeDetails(documentId, employeeData);
    return updatedEmployee;
  }
);

export const toggleEmployeeStatusThunk = createAsyncThunk(
  'employee/toggleEmployeeStatus',
  async (documentId, { rejectWithValue }) => {
    try {
      const updatedEmployee = await toggleEmployeeStatus(documentId);
      return updatedEmployee;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const uploadCSVThunk = createAsyncThunk(
  'employee/uploadCSV',
  async ({ companyId, parsedData, token }, { dispatch, rejectWithValue }) => {
    try {
      const response = await uploadCSVData(companyId, parsedData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveEmployeeChangesThunk = createAsyncThunk(
  'employee/approveEmployeeChanges',
  async ({ approvedData, companyId, token }, { rejectWithValue }) => {
    try {
      const response = await approveEmployeeChanges(approvedData, companyId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const resetProcessedCsvData = createAction('employee/resetProcessedCsvData');

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    uploadProgress: {
      isLoading: false,
      percentage: 0,
      message: '',
    },
    employeeChanges: {
      adds: [],
      edits: [],
    },
    processedCsvData: [],
    isComparisonDialogOpen: false,
    companyName: '',
    employees: [],
    isLoading: false,
    selectedEmployee: null,
    hasError: false,
    errorMessage: '',
  },
  reducers: {
    toggleEmployeeStatus: (state, action) => {
      const documentId = action.payload;
      const employeeIndex = state.employees.findIndex(emp => emp.documentId === documentId);
      state.selectedEmployee = state.employees[employeeIndex];

      if (employeeIndex !== -1) {
        state.employees[employeeIndex].isActive = !state.employees[employeeIndex].isActive;
      }
    },
    selectEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    deselectEmployee: (state) => {
      state.selectedEmployee = null;
    },
    clearEmployeeError: (state) => {
      state.hasError = false;
      state.errorMessage = '';
    },
    updateUploadProgress: (state, action) => {
      state.uploadProgress.percentage = action.payload;
      state.uploadProgress.message = `Uploading... ${action.payload}%`;
    },
    setProcessedCsvData: (state, action) => {
      state.processedCsvData = action.payload;
    },
    [resetProcessedCsvData]: (state) => {
      state.processedCsvData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEmployees
      .addCase(fetchEmployees.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
        state.isLoading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = action.payload || 'There was an issue loading the employees. Please try again later.';
        state.isLoading = false;
      })
      // addEmployeeThunk
      .addCase(addEmployeeThunk.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
        state.isLoading = true;
      })
      .addCase(addEmployeeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees.push(action.payload);
      })
      .addCase(addEmployeeThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload || 'There was an issue adding the employee. Please try again later.';
      })
      .addCase(updateEmployeeThunk.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
        state.isLoading = true;
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        const index = state.employees.findIndex(u => u.documentId === updatedUser.documentId);
        if (index !== -1) {
          state.employees[index] = updatedUser; // Update the employee in the state
        }
      })
      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.payload || 'There was an issue updating the employee details. Please try again later.';
      })
      .addCase(toggleEmployeeStatusThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.employees.findIndex(e => e.documentId === action.payload.documentId);
          if (index !== -1) {
            state.employees[index] = action.payload;
          }
        }
      })
      .addCase(toggleEmployeeStatusThunk.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.payload || 'There was an issue toggling the employee status. Please try again later.';
      })
      .addCase(uploadCSVThunk.pending, (state) => {
        state.uploadProgress.isLoading = true;
        state.uploadProgress.message = 'Uploading...';
        state.uploadProgress.percentage = 0;
      })
      .addCase(uploadCSVThunk.fulfilled, (state, action) => {
        state.employeeChanges = action.payload;
        state.uploadProgress.isLoading = false;
        state.uploadProgress.message = 'Upload complete!';
        state.uploadProgress.percentage = 100;
      })
      .addCase(uploadCSVThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.error.message;
        state.uploadProgress.isLoading = false;
        state.uploadProgress.message = 'Upload failed!';
        state.uploadProgress.percentage = 0;
      });
  }
});

export default employeeSlice.reducer;
export const { selectEmployee, deselectEmployee, clearEmployeeError, updateUploadProgress, setProcessedCsvData } = employeeSlice.actions;
