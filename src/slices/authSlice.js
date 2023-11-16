// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut as firebaseSignOut } from 'firebase/auth';
// import { firebaseAuth } from '../services/authfirebase';
// import { fetchAdminByEmail } from '../services/api';


// const auth = firebaseAuth;

// export const getAdminByEmail = createAsyncThunk(
//   'login/getAdminByEmail',
//   async (email, thunkAPI) => {
//     try {
      
//       const response = await fetchAdminByEmail(email);
//       console.log(response);
//       if (response.admin_email) {
//         await thunkAPI.dispatch(sendSignInLinkToEmailAction(email));
//         window.localStorage.setItem('admin', JSON.stringify(response));
//         return response;
//       } else {
//         return thunkAPI.rejectWithValue('This admin email is not registered in our systerm');
//       }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const sendSignInLinkToEmailAction = createAsyncThunk(
//   'auth/sendSignInLinkToEmail',
//   async (email, { rejectWithValue }) => {
//     try {
//       const actionCodeSettings = {
//         url: `${process.env.REACT_APP_BASE_URL}/signin-with-email`,
//         handleCodeInApp: true,
//       };
//       await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//       window.localStorage.setItem('emailForSignIn', email);
//       return email;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const signInWithEmailLinkAction = createAsyncThunk(
//   'auth/signInWithEmailLink',
//   async ({ email, emailLink }, { rejectWithValue }) => {
//     try {
//       if (!email || !isSignInWithEmailLink(auth, emailLink)) {
//         throw new Error('Invalid email sign-in link.');
//       }
//       const result = await signInWithEmailLink(auth, email, emailLink);
//       let admin = {};
//       try {
//         admin = JSON.parse(window.localStorage.getItem('admin')) || {};
//       } catch (error) {
//         console.warn('Failed to parse admin data from local storage.', error);
//       }
//       const essentialUserData = {
//         uid: result.user.uid,
//         email: result.user.email,
//         emailVerified: result.user.emailVerified,
//         providerData: result.user.providerData,
//         accessToken: result.user.accessToken,
//         ...admin
//       };
//       window.localStorage.setItem('admin', JSON.stringify(essentialUserData));
//       return essentialUserData;
//     } catch (error) {
//       console.error(error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const signOutAction = createAsyncThunk(
//   'auth/signOut',
//   async (_, { rejectWithValue }) => {
//     try {
//       await firebaseSignOut(auth);
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const initialState = {
//   currentAdmin: null,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     authStart: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     authSuccess: (state, action) => {
//       state.currentAdmin = action.payload;
//       state.loading = false;
//     },
//     authError: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//     },
//     setAuthState: (state, action) => {
//       state.currentAdmin = action.payload ? { ...action.payload } : null;
//     },
    
//     logoutSuccess: (state) => {
//       state.currentAdmin = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAdminByEmail.fulfilled, (state, action) => {
//         state.currentAdmin = {
//           ...state.currentAdmin,
//           ...action.payload
//         };
//         state.loading = false;
//       })
//       .addCase(getAdminByEmail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAdminByEmail.rejected, (state, action) => {
//         state.currentAdmin = null;
//         state.error = 'Admin is not in system, contact system support';
//         state.loading = false;
//       })
//       .addCase(sendSignInLinkToEmailAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sendSignInLinkToEmailAction.fulfilled, (state) => {
//         state.loading = false;
//         //state.currentAdmin.email = action.payload;
//       })
//       .addCase(sendSignInLinkToEmailAction.rejected, (state, action) => {
//         state.error = action.payload;
//         state.loading = false;
//       })
//       .addCase(signInWithEmailLinkAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(signInWithEmailLinkAction.fulfilled, (state, action) => {
//         state.currentAdmin = {
//           ...state.currentAdmin,
//           ...action.payload
//         };
//         state.loading = false;
//       })
//       .addCase(signInWithEmailLinkAction.rejected, (state, action) => {
//         state.error = action.payload;
//         state.loading = false;
//       })
//       .addCase(signOutAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(signOutAction.fulfilled, (state) => {
//         state.currentAdmin = null;
//         state.loading = false;
//       })
//       .addCase(signOutAction.rejected, (state, action) => {
//         state.error = action.payload;
//         state.loading = false;
//       });
//   }
// });

// export const { authStart, authSuccess, authError, logoutSuccess, setAuthState } = authSlice.actions;
// export default authSlice.reducer;
