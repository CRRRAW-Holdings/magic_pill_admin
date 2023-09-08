import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../services/authfirebase';

export const sendSignInLinkToEmail = createAsyncThunk(
  'auth/sendSignInLinkToEmail',
  async (email, { rejectWithValue }) => {
    try {
      await auth.sendSignInLinkToEmail(email, {
        url: 'YOUR_REDIRECT_URL',  // replace with your redirect URL
        handleCodeInApp: true,
      });
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const signInWithEmailLink = createAsyncThunk(
  'auth/signInWithEmailLink',
  async (_, { rejectWithValue }) => {
    try {
      const email = window.localStorage.getItem('emailForSignIn');
      if (!auth.isSignInWithEmailLink(window.location.href) || !email) {
        throw new Error('Invalid email sign-in link.');
      }

      const result = await auth.signInWithEmailLink(email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      return result.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await auth.signOut();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  user: null,
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
      state.user = action.payload;
      state.loading = false;
    },
    authError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutSuccess: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSignInLinkToEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSignInLinkToEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendSignInLinkToEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(signInWithEmailLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmailLink.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signInWithEmailLink.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { authStart, authSuccess, authError, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
// import { useDispatch } from 'react-redux';
// import { sendSignInLinkToEmail, signInWithEmailLink } from './authSlice';

// function MyComponent() {
//   const dispatch = useDispatch();

//   // For sending sign-in link
//   dispatch(sendSignInLinkToEmail(email));

//   // For signing in with email link
//   dispatch(signInWithEmailLink({ email, emailLink: window.location.href }));
// }