import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut as firebaseSignOut } from 'firebase/auth';
import { firebaseAuth } from '../services/authfirebase';
import { fetchAdminByEmail } from '../services/api';


const auth = firebaseAuth;

export const getAdminByEmail = createAsyncThunk(
  'login/getAdminByEmail',
  async (email, thunkAPI) => {
    try {
      const response = await fetchAdminByEmail(email);
      if (response.data.exists) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue('This admin email is not registered in our systerm');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sendSignInLinkToEmailAction = createAsyncThunk(
  'auth/sendSignInLinkToEmail',
  async (email, { rejectWithValue }) => {
    try {
      const actionCodeSettings = {
        url: `${process.env.REACT_APP_BASE_URL}/company`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.log('sendSignInLinkToEmail', error);
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithEmailLinkAction = createAsyncThunk(
  'auth/signInWithEmailLink',
  async (_, { rejectWithValue }) => {
    const emailLink = window.location.href;
    try {
      const email = window.localStorage.getItem('emailForSignIn');
      if (!isSignInWithEmailLink(auth, emailLink) || !email) {
        throw new Error('Invalid email sign-in link.');
      }

      const result = await signInWithEmailLink(auth, email, emailLink);
      window.localStorage.removeItem('emailForSignIn');
      return result.admin;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutAction = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  admin: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.admin = action.payload;
      state.loading = false;
    },
    authError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutSuccess: (state) => {
      state.admin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminByEmail.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.loading = false;
      })
      .addCase(getAdminByEmail.rejected, (state, action) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(sendSignInLinkToEmailAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSignInLinkToEmailAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendSignInLinkToEmailAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(signInWithEmailLinkAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmailLinkAction.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.loading = false;
      })
      .addCase(signInWithEmailLinkAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(signOutAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutAction.fulfilled, (state) => {
        state.admin = null;
        state.loading = false;
      })
      .addCase(signOutAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { authStart, authSuccess, authError, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
