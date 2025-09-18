// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components//auth/login'; 
import './css/App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* La ruta principal es para el componente de Login. */}
        <Route path="/" element={<Login />} />
        
        {/* Aquí puedes añadir otras rutas para el resto de la aplicación,
        como el dashboard una vez que el usuario se haya autenticado. */}
      </Routes>
    </Router>
  );
}

export default App;