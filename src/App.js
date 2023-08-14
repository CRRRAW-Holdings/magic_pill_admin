// Merged Imports
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Landing from './pages/Landing';
import Company from './pages/Company';
import Employee from './pages/Employee';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Company />} />
              <Route path="/company/:id" element={<Employee />} />
            </Routes>
          </Router>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
