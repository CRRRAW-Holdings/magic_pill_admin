import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Background from '../assets/images/background.png';

export const LoginAvatar = styled(Avatar)`
  margin: 10px;
  background-color: theme.palette.secondary.main;
`;

export const Wrapper = styled.div`
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

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // Center content horizontally
  max-width: 800px; 
  background: rgba(255, 255, 255, 0.8);
`;

export const LoginCard = styled(Card)`
  width: 500px;
  padding: 30px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  text-align: center;
`;

export const Logo = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom:20px;
`;

export const FormField = styled(TextField)`
  margin-bottom: 10px;
`;

export const LoginButton = styled(Button)`
  margin-top: 40px;
  height: 50px;
`;
