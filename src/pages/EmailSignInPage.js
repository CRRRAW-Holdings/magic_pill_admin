// EmailSignInPage.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailLinkAction } from '../slices/authSlice';

const EmailSignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const signIn = async () => {
      const resultAction = await dispatch(signInWithEmailLinkAction());
      console.warn('resultAction.meta.requestStatus',resultAction.meta.requestStatus `` );
      if (resultAction.meta.requestStatus === 'fulfilled') {
        navigate('/company');
      }
    };
    signIn();
  }, [dispatch, navigate]);

  return (
    <div>
      Signing you in...
    </div>
  );
};

export default EmailSignInPage;
