import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { FormField, LoginButton, Wrapper, Content, LoginCard, Logo } from '../styles/styledLanding';
import { isValidEmail } from '../utils/fieldUtil';
import logo from '../assets/images/logochandan2.png';
import { AuthContext } from '../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const LoginForm = ({ email, setEmail, password, setPassword, handleSubmit, submitted, loading, emailError }) => (
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
            error={submitted && (!isValidEmail(email) || emailError)}
            helperText={submitted && (emailError || (!isValidEmail(email) ? 'Invalid Email' : ''))}
        />
        <FormField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        <LoginButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
        >
          {loading ? 'Logging in...' : 'Sign-In'}
        </LoginButton>
      </form>
    </>
);

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  emailError: PropTypes.string
};

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { signInWithEmailAndPassword, loading: authLoading, currentUser, initializationCompleted } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValidEmail(email)) {
      setEmailError('Invalid Email');
      return;
    }
    setEmailError('');
    try {
      await signInWithEmailAndPassword(email, password);
      // Navigation to '/company' or handling of the login success is done within useEffect based on currentUser change
    } catch (error) {
      setEmailError(error.message); // Assuming signInWithEmailAndPassword function throws or passes error messages appropriately
    }
  };

  useEffect(() => {
    if (initializationCompleted && currentUser) {
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
              <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  handleSubmit={handleSubmit}
                  submitted={submitted}
                  loading={authLoading}
                  emailError={emailError}
              />
            </CardContent>
          </LoginCard>
        </Content>
      </Wrapper>
  );
};

export default Landing;
