import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { FormField, LoginButton } from '../styles/styledLanding';
import { useDispatch } from 'react-redux';
import { sendSignInLinkToEmail } from '../slices/authSlice';

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginForm = ({ toggleForm }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    
    if (isValidEmail(email)) {
      dispatch(sendSignInLinkToEmail(email));
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign In with Email Link
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={submitted && !isValidEmail(email)}
          helperText={submitted && !isValidEmail(email) ? 'Invalid Email' : ''}
        />
        <LoginButton type="submit" fullWidth variant="contained">
          Send Sign-In Link
        </LoginButton>
      </form>
    </>
  );
};

LoginForm.propTypes = {
  toggleForm: PropTypes.func.isRequired
};

export default LoginForm;
