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
  const [currentAdmin, setCurrentAdmin] = useState(null);
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
      throw new Error(error.message);
    }
  };

  const sendSignInLink = async (email) => {
    try {
      const actionCodeSettings = {
        url: `${process.env.REACT_APP_BASE_URL}/signin-with-email`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      throw new Error(error.message);
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
      const adminDetails = await fetchAdminByEmail(email);
      setCurrentAdmin(adminDetails);
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setCurrentAdmin(null);
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const adminDetails = await fetchAdminByEmail(user.email);
          setCurrentAdmin(adminDetails);
        } catch (error) {
          throw new Error(error.message);
        }
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

export default AuthProvider;
