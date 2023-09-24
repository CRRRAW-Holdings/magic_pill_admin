import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import logo from '../assets/images/logochandan2.png';
import {
  Wrapper,
  Content,
  LoginCard,
  Logo
} from '../styles/styledLanding';
import CheckEmail from './CheckEmail';  // import the new component
import LoginForm from './LoginForm';


const Landing = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Redux hooks
  const loginState = useSelector(state => state.auth.loading ? 'loading' : state.auth.error ? 'error' : 'success');

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const [emailVerified, setEmailVerified] = useState(false);

  return (
    <Wrapper>
      <Content>
        <LoginCard>
          <CardContent>
            <Logo src={logo} alt="Magic Pill Logo" />
            {emailVerified ? <CheckEmail /> : <LoginForm setEmailVerified={setEmailVerified} toggleForm={toggleForm} />}
            {loginState === 'error' && (
              <Typography
                color="error"
                style={{ marginTop: '16px' }}
              >
                {'Error: This admin email is not registered in our system'}
              </Typography>
            )}
          </CardContent>
        </LoginCard>
      </Content>
    </Wrapper>
  );
};
export default Landing;
