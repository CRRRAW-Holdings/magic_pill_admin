import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { selectAuthIsLoading } from '../selectors';
import { AuthContext } from '../utils/AuthProvider';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ path, element }) => {
  const { currentAdmin, initializationCompleted } = useContext(AuthContext);
  const isLoading = useSelector(selectAuthIsLoading);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(isLoading, currentAdmin);
    if (initializationCompleted && !isLoading && !currentAdmin) {
      navigate('/', { replace: true, state: { from: path } });
    }
  }, [isLoading, currentAdmin, navigate, path, initializationCompleted]);

  if (!initializationCompleted || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress style={{ color: '#ffffff' }} />
      </div>
    );
  }

  if (currentAdmin) {
    return element;
  }

  return null;
};

export default PrivateRoute;
