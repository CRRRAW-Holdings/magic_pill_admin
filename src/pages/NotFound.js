import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  color: '#FFFFFF',
});

const NotFound = () => {
  return (
    <StyledContainer>
      <Typography variant="h1">404</Typography>
      <Typography variant="h4">Page Not Found</Typography>
      <Typography variant="body1">Sorry, the page you are looking for does not exist.</Typography>
    </StyledContainer>
  );
};

export default NotFound;
