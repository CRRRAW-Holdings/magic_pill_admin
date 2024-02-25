import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';

const EmailSignInPage = () => {
  const { signInWithEmail } = useContext(AuthContext); 
  const navigate = useNavigate();
  console.log('emailsignin');

  useEffect(() => {
    const signIn = async () => {
      try {
        const email = window.localStorage.getItem('emailForSignIn');
        const emailLink = window.location.href;

        if (!email || !emailLink) {
          throw new Error('Email or email link is missing');
        }

        await signInWithEmail(email, emailLink);
        navigate('/company');
      } catch (error) {
        console.error('Error signing in:', error.message);
        // Handle error (e.g., navigate to an error page or display a message)
      }
    };

    signIn();
  }, [signInWithEmail, navigate]); // Make sure the dependencies are correct

  return (
    <div>
      Signing you in...
    </div>
  );
};

export default EmailSignInPage;
