import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { FormField, LoginButton, Wrapper, Content, LoginCard, Logo } from '../styles/styledLanding';
import { isValidEmail } from '../utils/fieldUtil';
import logo from '../assets/images/logochandan2.png';
import CheckEmail from './CheckEmail';
import { AuthContext } from '../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const LoginForm = ({ email, setEmail, handleSubmit, submitted, loading, emailError }) => (
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
        error={submitted && (!isValidEmail(email) || emailError)}
        helperText={submitted && (emailError || (!isValidEmail(email) ? 'Invalid Email' : ''))}
      />
      <LoginButton
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
      >
        {loading ? 'Verifying Email...' : 'Send Sign-In Link'}
      </LoginButton>
    </form>
  </>
);

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  emailError: PropTypes.string
};

const Landing = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { currentUser, currentAdmin,  loading: authLoading, checkAdminByEmail, initializationCompleted } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(currentAdmin);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValidEmail(email)) {
      setEmailError('Invalid Email');
      return;
    }
    setEmailError('');
    setEmailVerificationLoading(true);
    try {
      await checkAdminByEmail(email);
      setEmailLinkSent(true);
    } catch (error) {
      setEmailError('Failed to verify email. Please try again.'); // Set error message on failure
      console.log(error);
    } finally {
      setEmailVerificationLoading(false);
    }
  };
  

  useEffect(() => {
    if (initializationCompleted && currentUser?.uid) {
      navigate('/company');
    }
  }, [initializationCompleted, currentUser, navigate]);

  
  if (!initializationCompleted || authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Wrapper>
      <Content>
        <LoginCard>
          <CardContent>
            <Logo src={logo} alt="Logo" />
            {emailLinkSent && !currentUser?.uid ? (
              <CheckEmail />
            ) : (
              <LoginForm {...{ email, setEmail, handleSubmit, submitted, loading: emailVerificationLoading, emailError }} />
            )}
          </CardContent>
        </LoginCard>
      </Content>
    </Wrapper>
  );
};

export default Landing;