import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import React, { createContext, useEffect, useState } from 'react';
import { firebaseAuth } from '../services/authfirebase';
import { selectAdminData } from '../selectors';
import { logoutSuccess, setAuthState, signInWithEmailLinkAction, signOutAction, } from '../slices/authSlice';

const auth = firebaseAuth;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const currentAdmin = useSelector(selectAdminData);
  const [initializationCompleted, setInitializationCompleted] = useState(false);


  const signInWithEmailLink = (email, emailLink) => {
    dispatch(signInWithEmailLinkAction({ email, emailLink }));
  };

  const signOut = () => {
    dispatch(signOutAction());
    window.localStorage.removeItem('admin');
    window.localStorage.removeItem('email');
    console.log('SIGNOUT', window.localStorage, currentAdmin);
  };
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const storedAdmin = JSON.parse(window.localStorage.getItem('admin'));
      
      if (user) {
        console.log('LOGIN OR YES USER');
  
        const userData = {
          ...storedAdmin,
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          providerData: user.providerData,
          accessToken: user.accessToken
        };
  
        dispatch(setAuthState(userData));
    
        const prevStoredAdmin = JSON.parse(window.localStorage.getItem('admin'));
        if (JSON.stringify(prevStoredAdmin) !== JSON.stringify(userData)) {
          console.log('SET LOCAL ADMIN COMBINATION');
          window.localStorage.setItem('admin', JSON.stringify(userData));
          console.log(window.localStorage);
        }
      } else if (storedAdmin) {
        console.log('NO FIREBASE USER, BUT LOCALSTORE ADMIN EXISTS');
        // Handle the scenario where there's no Firebase user, but there's data in localStorage.
        // E.g., you can dispatch a different action or set a state that will prompt the user to re-login.
      } else {
        console.log('LOGOUT OR NO USER');
        dispatch(logoutSuccess());
        window.localStorage.removeItem('admin');
        window.localStorage.removeItem('email');
      }
      setInitializationCompleted(true);
    });
    
    return () => unsubscribe();
  }, [dispatch]);
  
  
  
  
  return (
    <AuthContext.Provider value={{ currentAdmin, signInWithEmailLink, signOut, initializationCompleted }}>
      {children}
    </AuthContext.Provider>
  );
};


AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
