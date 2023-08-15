import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { attemptLogin } from '../slices/loginSlice';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import logo from '../assets/images/logochandan2.png';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { 
  LoginAvatar, 
  Wrapper, 
  Content, 
  LoginCard, 
  Logo, 
  FormField, 
  LoginButton 
} from '../styles/styledLanding';


const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


const Landing = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  // Redux hooks
  const dispatch = useDispatch();
  const loginState = useSelector(state => state.login.loading ? 'loading' : state.login.error ? 'error' : 'success');

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(attemptLogin({ username, password }));
  };

  const loginError = useSelector(state => state.login.error);

  // Side effect to check if the login was successful, then navigate
  useEffect(() => {
    //   if (loginState === 'success') {
    //     navigate('/home');
    //   }
  }, [loginState, navigate]);

  return (
    <Wrapper>
      <Content>
        <LoginCard>
          <CardContent>
            <LoginAvatar>
              <LockOutlinedIcon />
            </LoginAvatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Logo src={logo} alt="Magic Pill Logo" />
            <form onSubmit={handleSubmit}>
              <FormField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={e => setUsername(e.target.value)}
                error={!isValidEmail(username)}
                helperText={!isValidEmail(username) ? 'Invalid email' : ''}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
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
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <LoginButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValidEmail(username) || password.length === 0 || loginState === 'loading'}
              >
                {loginState === 'loading' ? <CircularProgress size={24} /> : 'Login'}
              </LoginButton>            </form>
            <Grid container justifyContent="space-between" style={{ marginTop: '10px' }}>
              <Grid item>
                <Typography variant="caption">
                  <Link href="#" variant="caption">
                    Forgot password?
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            {loginState === 'error' && <p>{loginError}</p>}
          </CardContent>
        </LoginCard>
      </Content>
    </Wrapper>
  );
};

export default Landing;
