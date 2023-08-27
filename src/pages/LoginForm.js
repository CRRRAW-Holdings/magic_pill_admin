import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { FormField, LoginButton } from '../styles/styledLanding';

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginForm = ({ onSubmit, toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    onSubmit(email, password);
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign In
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
        <LoginButton type="submit" fullWidth variant="contained">
          Login
        </LoginButton>
      </form>
    </>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired
};

export default LoginForm;
