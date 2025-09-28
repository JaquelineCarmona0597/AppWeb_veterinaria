// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './css/index.css';
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