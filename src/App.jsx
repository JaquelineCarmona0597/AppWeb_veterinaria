// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/login'; // Importa el nuevo componente
import AdminPanel from './components/admin/adminpanel';
import './css/App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* La ruta principal ahora usará el nuevo componente Login */}
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;