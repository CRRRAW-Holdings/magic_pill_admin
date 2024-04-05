import PropTypes from 'prop-types';
import React, { createContext, useEffect, useState } from 'react';
import { firebaseAuth } from '../services/authfirebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { fetchAdminByEmail } from '../services/api';

const auth = firebaseAuth;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializationCompleted, setInitializationCompleted] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle signing in with email and password
  const signInWithEmailAndPasswordHandler = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user);
      const adminDetails = await fetchAdminByEmail(email);
      setCurrentAdmin(adminDetails);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle signing out
  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setCurrentAdmin(null);
    } catch (error) {
      setError(error.message);
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
          setError(error.message);
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
      <AuthContext.Provider value={{
        currentUser,
        currentAdmin,
        error,
        loading,
        initializationCompleted,
        signInWithEmailAndPassword: signInWithEmailAndPasswordHandler,
        signOut,
      }}>
        {children}
      </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
