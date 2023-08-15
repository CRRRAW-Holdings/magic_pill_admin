import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmployeesFromCompany, addEmployeeToCompany, updateEmployeeDetails, toggleEmployeeStatus, uploadCSVData } from '../services/api';

export const fetchEmployees = createAsyncThunk(
  'employee/fetchByCompanyId',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await fetchEmployeesFromCompany(companyId);
      const companyData = response.data.results[0].company;
      const users = response.data.results[0].users;

      return {
        companyName: companyData.insurance_company_name,
        users
      };

    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : 'Network error. Please try again.');
    }
  }
);


export const addEmployeeThunk = createAsyncThunk(
  'employee/addEmployee',
  async ({ companyId, employeeData }) => {
    const transformedData = {
      ...employeeData,
      insurance_company_id: employeeData.insurance_company_id,
      magic_pill_plan_id: employeeData.magic_pill_plan_id,
    };

    const response = await addEmployeeToCompany(companyId, transformedData);
    console.log(response, 'ADD');
    return transformedData;
  }
);


// Async thunk to update an employee
export const updateEmployeeThunk = createAsyncThunk(
  'employee/updateEmployee',
  async ({ companyId, employeeData }) => {
    console.log(companyId, employeeData, 'thunk');
    // use companyId and employeeData as needed
    const response = await updateEmployeeDetails(employeeData);
    return response.data;
  }
);


export const toggleEmployeeStatusThunk = createAsyncThunk(
  'employee/toggleEmployeeStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await toggleEmployeeStatus(userId);
      return response.data.results[0].success;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  }
);

// In your employeeSlice.js or where you keep your thunks

export const uploadCSVThunk = createAsyncThunk(
  'employee/uploadCSV',
  async (csvData, api) => {
    try {
      const response = await uploadCSVData(csvData, (progress) => {
        api.dispatch(updateUploadProgress(progress));  // Dispatch the progress update
      });
      return response;
    } catch (error) {
      return api.rejectWithValue(error.message);
    }
  }
);

// In your employeeSlice.js or where you keep your thunks

export const previewCSVThunk = createAsyncThunk(
  'employee/previewCSV',
  async (csvData, { dispatch, getState }) => {
    try {
      return csvData;  // If you want to keep this in the state.
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);






// Your slice
const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    uploadProgress: {
      isLoading: false,  // A boolean flag to know if something is uploading.
      percentage: 0,    // The upload progress as a percentage.
      message: '',
    },
    processedCsvData: [],
    isComparisonDialogOpen: false,      // Useful for displaying specific messages to the user.
    companyName: null,
    employees: [],
    loading: false,
    selectedEmployee: null,
    hasError: false,
    errorMessage: '',
  },
  reducers: {
    toggleEmployeeStatus: (state, action) => {
      const userId = action.payload;
      const employeeIndex = state.employees.findIndex(emp => emp.user_id === userId);
      state.selectedEmployee = state.employees[employeeIndex];

      if (employeeIndex !== -1) {
        state.employees[employeeIndex].is_active = !state.employees[employeeIndex].is_active;
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
      console.log(state, action,'CONSOLEEE');
      state.processedCsvData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEmployees
      .addCase(fetchEmployees.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        console.log(action, 'fetchEmployees');
        state.companyName = action.payload.companyName;
        state.employees = action.payload.users;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = action.payload || 'There was an issue loading the employees. Please try again later.';
      })

      // addEmployeeThunk
      .addCase(addEmployeeThunk.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(addEmployeeThunk.fulfilled, (state, action) => {
        console.log(action.payload);
        state.employees.push(action.payload);
      })
      .addCase(addEmployeeThunk.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = action.payload || 'There was an issue adding the employee. Please try again later.';
      })

      // updateEmployeeThunk
      .addCase(updateEmployeeThunk.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        const index = state.employees.findIndex(e => e.employee_id === action.payload.employee_id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })

      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = action.payload || 'There was an issue updating the employee details. Please try again later.';
      })

      // toggleEmployeeStatusThunk
      .addCase(toggleEmployeeStatusThunk.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(toggleEmployeeStatusThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.employees.findIndex(e => e.user_id === action.meta.arg);
          if (index !== -1) {
            state.employees[index].is_active = !state.employees[index].is_active;
          }
        }
      })
      .addCase(toggleEmployeeStatusThunk.rejected, (state, action) => {
        state.hasError = true;
        state.errorMessage = action.payload || 'There was an issue toggling the employee status. Please try again later.';
      })
      .addCase(uploadCSVThunk.pending, (state) => {
        state.uploadProgress.isLoading = true;
        state.uploadProgress.message = 'Uploading...';
        // Reset percentage
        state.uploadProgress.percentage = 0;
      })
      .addCase(uploadCSVThunk.fulfilled, (state) => {
        state.uploadProgress.isLoading = false;
        state.uploadProgress.message = 'Upload complete!';
        state.uploadProgress.percentage = 100;
      })
      .addCase(uploadCSVThunk.rejected, (state, action) => {
        state.loading = false;
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
