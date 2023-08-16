import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { FormField, LoginButton } from '../styles/styledLanding';
import { handleSignUp } from '../utils/authUtil';

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SignUpForm = ({ toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [submitted, setSubmitted] = useState(false); // <-- Add this line
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true); // <-- Set submitted to true here

    if (password !== confirmedPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await handleSignUp(email, password);
    } catch (error) {
      console.error('Failed to signup:', error.message);
    }
  };
  return (
    <>
      <Typography component="h1" variant="h5">
                Sign Up
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        {/* The Email, Password, and Confirm Password fields */}
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
        <FormField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <FormField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmedPassword"
          label="Confirm Password"
          type="password"
          id="confirmedPassword"
          value={confirmedPassword}
          onChange={e => setConfirmedPassword(e.target.value)}
          error={submitted && password !== confirmedPassword}
          helperText={submitted && password !== confirmedPassword ? 'Passwords do not match' : ''}
        />
        <LoginButton type="submit" fullWidth variant="contained">
                    Sign Up
        </LoginButton>
      </form>
    </>
  );
};

SignUpForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};


export default SignUpForm;
