import { createTheme } from '@mui/material';
import Background from './assets/images/background.png';

export const commonButtonStyles = {
  minWidth: '100px',
  height: '40px',
  padding: '10px 20px',
};

export const inputStyles = ({ theme }) => ({
  padding: '10px',
  display: 'block',  
  fontFamily: 'Roboto, sans-serif',  
  '& .MuiInputBase-root': {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',  
    border: '1px solid #ddd',  
    borderRadius: '4px',
    '& .MuiInputBase-input': {
      color: '#fff',
      '&::placeholder': {
        color: '#fff',  
      },
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#888',  
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#888',  
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ddd',  
  },
});

const theme = createTheme({
  palette: {
    baseWhite: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    primary: {
      main: '#390072',
      light: '#5e2394',
      dark: '#2e0064',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#009688',
      light: '#4db6ac',
      dark: '#00796b',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff6370',
      light: '#fbeff0',
      dark: '#ee6c72',
      contrastText: '#000',
    },
    warning: {
      main: '#ffa726',
      light: '#ffbc58',
      dark: '#c77f00',
      contrastText: '#000',
    },
    success: {
      main: '#66bb6a',
      light: '#8be097',
      dark: '#3f8a3f',
      contrastText: '#ffffff',
    },
    grey: {
      main: '#c2c2c2',
      light: '#bdbdbd',
      dark: '#616161',
      contrastText: '#000',
    },
    oceanicDeep: {
      main: '#003366',
      light: '#336699',
      dark: '#001a33',
      contrastText: '#ffffff',
    },
    rusticRedwood: {
      main: '#8B0000',
      light: '#B32E2E',
      dark: '#660000',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '\'Roboto\', sans-serif',
    fontSize: 16,
    h2: {
      color: '#FFFFFF',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${Background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', 
          backgroundAttachment: 'fixed',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(12, 0, 128, 0.4)',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(211, 0, 100, 0.8)',
        },
      },
    },
  },
});

export default theme;

