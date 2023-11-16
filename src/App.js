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
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className='App'>
            <header className='App-header'>
              <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/company' element={<PrivateRoute path='/company' element={<Company />} />} />
                <Route path='/company/:id' element={<PrivateRoute path='/company/:id' element={<Employee />} />} />
                <Route path='/signin-with-email' element={<EmailSignInPage />} />
                <Route path='*' element={<PrivateRoute path='*' element={<NotFound />} />} />
              </Routes>
            </header>
          </div>
        </Router>
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
  );
}


export default App;
