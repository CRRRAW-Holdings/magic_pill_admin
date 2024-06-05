import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthProvider'; // Ensure this path matches where AuthProvider is located
import { isValidEmail } from '../utils/fieldUtil';
import { FormField, LoginButton, Wrapper, Content, LoginCard, Logo } from '../styles/styledLanding';
import logo from '../assets/images/logochandan2.png';

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  submitted,
  loading,
  authError,
  onForgotPassword, // Include the onForgotPassword function
}) => (
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
        onChange={(e) => setEmail(e.target.value)}
        error={submitted && (!isValidEmail(email) || authError)}
        helperText={submitted && ((!isValidEmail(email) ? 'Invalid Email' : ''))}
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
        onChange={(e) => setPassword(e.target.value)}
      />
      {submitted && authError && (
        <Typography color="error" style={{ marginTop: 8 }}>
          {authError}
        </Typography>
      )}
      <LoginButton
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Sign In'}
      </LoginButton>
      <Typography align="center" style={{ marginTop: 16 }}>
        <Link
          component="button"
          variant="body2"
          onClick={onForgotPassword} // Call the onForgotPassword function when clicked
        >
                    Forgot Password?
        </Link>
      </Typography>
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
  authError: PropTypes.string,
  onForgotPassword: PropTypes.func.isRequired, // Add propType for onForgotPassword
};

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const {
    signInWithEmailAndPassword,
    loading: authLoading,
    currentUser,
    initializationCompleted,
    error: authError,
    resetPassword, // Destructure the resetPassword function from AuthContext
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValidEmail(email)) {
      return;
    }
    await signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (initializationCompleted && currentUser) {
      navigate('/company');
    }
  }, [initializationCompleted, currentUser, navigate]);

  // Function to handle forgot password action
  const handleForgotPassword = () => {
    const userEmail = window.prompt('Please enter your email address:');
    if (userEmail) {
      resetPassword(userEmail).then(() => {
        alert('If there is an account associated with that email, a reset link has been sent.');
      }).catch((error) => {
        alert('Failed to send reset email. Please try again.');
      });
    }
  };

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
              authError={authError}
              onForgotPassword={handleForgotPassword} // Pass the forgot password handler
            />
          </CardContent>
        </LoginCard>
      </Content>
    </Wrapper>
  );
};

export default Landing;
