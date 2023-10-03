import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Landing from './pages/Landing';
import Company from './pages/Company';
import Employee from './pages/Employee';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailSignInPage from './pages/EmailSignInPage';
import { AuthProvider } from './utils/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='App'>
        <header className='App-header'>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path='/' element={<Landing />} />
                <Route path="/company" element={<PrivateRoute path="/company" element={<Company />} />} />
                <Route path='/company/:id' element={<Employee />} />
                <Route path='/signin-with-email' element={<EmailSignInPage />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
          <ToastContainer />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;

