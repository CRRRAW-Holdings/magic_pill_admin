import PropTypes from 'prop-types';
import React, { createContext, useEffect, useState } from 'react';
import { firebaseAuth } from '../services/authfirebase';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { fetchAdminByEmail } from '../services/api';

const auth = firebaseAuth;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null); // Add this state
  const [loading, setLoading] = useState(true);
  const [initializationCompleted, setInitializationCompleted] = useState(false);


  const checkAdminByEmail = async (email) => {
    try {
      const response = await fetchAdminByEmail(email.toLowerCase());
      if (response.email) {
        await sendSignInLink(email);
        return response;
      } else {
        throw new Error('This admin email is not registered in our system');
      }
    } catch (error) {
      console.error(error.message);
      // Handle error (e.g., show notification)
    }
  };

  const sendSignInLink = async (email) => {
    try {
      const actionCodeSettings = {
        // url: `${process.env.REACT_APP_BASE_URL}/signin-with-email`,
        url: 'http://localhost:3000/signin-with-email',
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error(error.message);
      // Handle error
    }
  };

  const signInWithEmail = async (email, emailLink) => {
    setLoading(true);
    try {  
      if (!email || !isSignInWithEmailLink(auth, emailLink)) {
        throw new Error('Invalid email sign-in link.');
      }
      const result = await signInWithEmailLink(auth, email, emailLink);
      setCurrentUser(result.user);
      const adminDetails = await fetchAdminByEmail(email); // Fetch admin details
      setCurrentAdmin(adminDetails); // Set admin details
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const adminDetails = await fetchAdminByEmail(user.email);
        setCurrentAdmin(adminDetails);
      } else {
        setCurrentAdmin(null);
      }
      setLoading(false);
      setInitializationCompleted(true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, currentAdmin, loading, initializationCompleted, checkAdminByEmail, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
