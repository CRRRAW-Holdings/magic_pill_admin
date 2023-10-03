import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider'; // Adjust the path if needed
import { useNavigate } from 'react-router-dom';

const EmailSignInPage = () => {
  const { signInWithEmailLink } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const signIn = async () => {
      try {
        const email = window.localStorage.getItem('emailForSignIn');
        const emailLink = window.location.href;
        await signInWithEmailLink(email, emailLink);
        navigate('/company');
      } catch (error) {
        console.error('Error signing in:', error.message);
      }
    };
    signIn();
  }, [signInWithEmailLink, navigate]);

  return (
    <div>
      Signing you in...
    </div>
  );
};

export default EmailSignInPage;
