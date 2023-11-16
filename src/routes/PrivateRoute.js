import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../utils/AuthProvider';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ path, element }) => {
  const { currentUser, initializationCompleted, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (initializationCompleted && !loading && !currentUser) {
      navigate('/', { replace: true, state: { from: path } });
    }
  }, [loading, currentUser, navigate, path, initializationCompleted]);

  if (!initializationCompleted || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress style={{ color: '#ffffff' }} />
      </div>
    );
  }

  if (currentUser) {
    return element;
  }

  return null;
};

export default PrivateRoute;
