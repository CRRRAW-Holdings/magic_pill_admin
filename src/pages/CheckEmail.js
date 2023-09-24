// CheckEmail.js

import React from 'react';
import Typography from '@mui/material/Typography';

const CheckEmail = () => {
  return (
    <>
      <Typography component="h1" variant="h5">
        Check Your Email
      </Typography>
      <Typography>
        We have sent a sign-in link to your email. Please check your inbox to continue.
      </Typography>
    </>
  );
};

export default CheckEmail;
