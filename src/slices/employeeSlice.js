import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
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
    console.log(response);
    return transformedData;
  }
);


// Async thunk to update an employee
export const updateEmployeeThunk = createAsyncThunk(
  'employee/updateEmployee',
  async ({ companyId, employeeData }) => {
    // use companyId and employeeData as needed
    const response = await updateEmployeeDetails(employeeData);
    return response.data.results[0]?.user;
  }
);


export const toggleEmployeeStatusThunk = createAsyncThunk(
  'employee/toggleEmployeeStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await toggleEmployeeStatus(userId);
      return response.data.results[0].success;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// In your employeeSlice.js or where you keep your thunks

export const uploadCSVThunk = createAsyncThunk(
  'employee/uploadCSV',
  async (csvData, api) => {
    try {
      console.log(csvData);
      const response = await uploadCSVData(csvData, (progress) => {
        api.dispatch(updateUploadProgress(progress));
      });
      console.log(response);
      return response;
    } catch (error) {
      return api.rejectWithValue(error.message);
    }
  }
);

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


export const resetProcessedCsvData = createAction('employee/resetProcessedCsvData');

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    uploadProgress: {
      isLoading: false,
      percentage: 0,
      message: '',
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
        state.isLoading= true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.companyName = action.payload.companyName;
        state.employees = action.payload.users;
        state.isLoading= false;
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
        state.isLoading=true;
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        // Finding the index of the user to be updated.
        const index = state.employees.findIndex(u => u.user_id === updatedUser.user_id);
        if (index !== -1) {
          // Replacing the old user data with the updated data.
          state.employees[index] = updatedUser;
        }
      })
      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.payload || 'There was an issue updating the employee details. Please try again later.';
      })

      // toggleEmployeeStatusThunk
      .addCase(toggleEmployeeStatusThunk.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
        state.isLoading = true;
      })
      .addCase(toggleEmployeeStatusThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.employees.findIndex(e => e.user_id === action.meta.arg);
          if (index !== -1) {
            state.employees[index].is_active = !state.employees[index].is_active;
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
        // Reset percentage
        state.uploadProgress.percentage = 0;
      })
      .addCase(uploadCSVThunk.fulfilled, (state, action) => {
        state.employees = action.payload;
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
