import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { FormField, LoginButton } from '../styles/styledLanding';
import { useDispatch } from 'react-redux';
import { sendSignInLinkToEmailAction, getAdminByEmail } from '../slices/authSlice';
import { isValidEmail } from '../utils/emailUtil';


const LoginForm = ({ toggleForm, setEmailVerified }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValidEmail(email)) return;

    setEmailVerificationLoading(true);

    try {
      const action = await dispatch(getAdminByEmail(email));

      if (action.payload && action.payload.exists) {
        setEmailVerified(true);
        dispatch(sendSignInLinkToEmailAction(email));
      } else {
        // Handle non-existent email, maybe set an error message for the user
        // console.log("Email doesn't exist.");
      }
    } catch (error) {
      // Handle the error, maybe display it to the user
      console.log('Error verifying email:', error.message);
    } finally {
      setEmailVerificationLoading(false);
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
        <LoginButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={emailVerificationLoading}
        >
          {emailVerificationLoading ? 'Verifying Email...' : 'Send Sign-In Link'}
        </LoginButton>

      </form>
    </>
  );
};

LoginForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  setEmailVerified: PropTypes.func.isRequired  // ensure setEmailVerified is passed down
};

export default LoginForm;
