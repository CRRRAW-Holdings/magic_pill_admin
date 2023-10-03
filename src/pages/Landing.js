import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { FormField, LoginButton, Wrapper, Content, LoginCard, Logo } from '../styles/styledLanding';
import { getAdminByEmail } from '../slices/authSlice';
import { isValidEmail } from '../utils/fieldUtil';
import logo from '../assets/images/logochandan2.png';
import CheckEmail from './CheckEmail';
import { AuthContext } from '../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// const ERROR_MESSAGE = 'Error: This admin email is not registered in our system';

const LoginForm = ({ email, setEmail, handleSubmit, submitted, loading }) => (
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
};


const Landing = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { currentAdmin, initializationCompleted} = useContext(AuthContext);
  const navigate = useNavigate();


  const loginState = useSelector(state => state.auth.loading ? 'loading' : state.auth.error ? 'error' : 'success');
  const error = useSelector(state => state.auth.error); // Use this for a descriptive error message
  const loading = useSelector(state => state.auth.loading); // Use this for a descriptive error message

  const dispatch = useDispatch();


  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValidEmail(email)) return;
    dispatch(getAdminByEmail(email));
  };

  useEffect(() => {
    if (initializationCompleted && currentAdmin?.uid) {
      console.log(currentAdmin, '*****LANDING**** currentAdmin');
      navigate('/company');
    }
  }, [initializationCompleted, currentAdmin, navigate]);

  // Before initialization is completed or while logging in, show a loading spinner
  if (!initializationCompleted || loading) {
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
            <Logo src={logo} alt="Magic Pill Logo" />
            {currentAdmin?.exists ? <CheckEmail /> : <LoginForm {...{ email, setEmail, handleSubmit, submitted, loading }} />}
            {loginState === 'error' && (
              <Typography color="error" style={{ marginTop: '16px' }}>
                {error}
              </Typography>
            )}
          </CardContent>
        </LoginCard>
      </Content>
    </Wrapper>
  );
};

export default Landing;