import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { attemptLogin } from '../slices/loginSlice';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CardContent from '@mui/material/CardContent';
import logo from '../assets/images/logochandan2.png';
import {
  LoginAvatar,
  Wrapper,
  Content,
  LoginCard,
  Logo
} from '../styles/styledLanding';
import LoginForm from './LoginForm'; 
import SignUpForm from './SignUpForm';

const Landing = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Redux hooks
  const dispatch = useDispatch();
  const loginState = useSelector(state => state.login.loading ? 'loading' : state.login.error ? 'error' : 'success');
  const loginError = useSelector(state => state.login.error);

  const handleLogin = (email, password) => {
    dispatch(attemptLogin({ email, password }));
  };

  const handleSignup = (email, password) => {
    // Dispatch signup action here
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Wrapper>
      <Content>
        <LoginCard>
          <CardContent>
            <LoginAvatar>
              <LockOutlinedIcon />
            </LoginAvatar>
            <Typography component="h1" variant="h5">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Typography>
            <Logo src={logo} alt="Magic Pill Logo" />
            {isSignUp ? 
              <SignUpForm onSubmit={handleSignup} toggleForm={toggleForm} /> : 
              <LoginForm onSubmit={handleLogin} toggleForm={toggleForm} />}
            <Grid container justifyContent="space-between" style={{ marginTop: '10px' }}>
              <Grid item>
                <Typography variant="caption">
                  <Link href="#" variant="caption" onClick={toggleForm}>
                    {isSignUp ? 'Already have an account? Login' : 'Dont have an account? Sign up'}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            {loginState === 'error' && <Typography color="error">{loginError}</Typography>}
          </CardContent>
        </LoginCard>
      </Content>
    </Wrapper>
  );
};

export default Landing;
