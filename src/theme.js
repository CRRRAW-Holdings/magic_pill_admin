import { createTheme } from '@mui/material';
import Background from './assets/images/background.png';

const theme = createTheme({
  palette: {
    baseWhite: {
      main: '#FFFFFF',
      contrastText: '#000000', // Assuming black text will be contrasted on a white background
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
    info: {
      main: '#4fc3f7',
      light: '#81d4fa',
      dark: '#039be5',
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
    lunarSilver: {
      main: '#b0b0b0',
      light: '#e0e0e0',
      dark: '#808080',
      contrastText: '#000000',
    },
    coralReef: {
      main: '#FF6B6B',
      light: '#FF9E9E',
      dark: '#CC4B4B',
      contrastText: '#ffffff',
    },
    earthyClay: {
      main: '#704214',
      light: '#A67238',
      dark: '#45240E',
      contrastText: '#ffffff',
    },
    mountainPeak: {
      main: '#848482',
      light: '#B0B0AE',
      dark: '#575754',
      contrastText: '#ffffff',
    },
    urbanJungle: {
      main: '#4E8F3A',
      light: '#7BC468',
      dark: '#315E25',
      contrastText: '#ffffff',
    },
    desertMirage: {
      main: '#FFD27F',
      light: '#FFEAB5',
      dark: '#CBA152',
      contrastText: '#000000',
    },
    nauticalNavy: {
      main: '#001F3F',
      light: '#004080',
      dark: '#001133',
      contrastText: '#ffffff',
    },
    lushLavender: {
      main: '#B57EDC',
      light: '#D9A8EA',
      dark: '#8E5BAF',
      contrastText: '#000000',
    },
    icyGlacier: {
      main: '#A0E6FF',
      light: '#D1FAFF',
      dark: '#6EC3DB',
      contrastText: '#000000',
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

