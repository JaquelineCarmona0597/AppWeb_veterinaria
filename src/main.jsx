// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './css/index.css';
// Import Font Awesome from local npm package to avoid CDN storage access blocked by some browsers
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from './context/AuthContext.jsx';
const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
        
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);