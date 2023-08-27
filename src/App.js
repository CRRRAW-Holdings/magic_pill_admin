import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Landing from './pages/Landing';
import Company from './pages/Company';
import Employee from './pages/Employee';
import NotFound from './pages/NotFound';

// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';

// // Use environment variables for Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // eslint-disable-next-line no-unused-vars
// const analytics = getAnalytics(app);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='App'>
        <header className='App-header'>
          <Router>
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/company' element={<Company />} />
              <Route path='/company/:id' element={<Employee />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Router>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
