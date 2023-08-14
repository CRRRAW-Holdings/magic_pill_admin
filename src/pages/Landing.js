
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { attemptLogin } from '../slices/loginSlice'; // Assuming you've an action for login
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress'; // for loading spinner
import Background from '../assets/images/background.png';
import logo from '../assets/images/logochandan2.png';


const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(${Background}) no-repeat center center fixed; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // Center content horizontally
  max-width: 800px; 
  background: rgba(255, 255, 255, 0.8);
`;

const LoginCard = styled(Card)`
  width: 500px;
  padding: 30px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  text-align: center;
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom:20px;
`;

const FormField = styled(TextField)`
  margin-bottom: 10px;
`;

const LoginButton = styled(Button)`
  margin-top: 40px;
  height: 50px;
`;

const Landing = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
    
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
              </LoginButton>
            </form>
            {/* Display any potential error messages from the API or Redux state */}
            {loginState === 'error' && <p>{loginError}</p>}
          </CardContent>
        </LoginCard>
      </Content>
    </Wrapper>
  );
};

export default Landing;

