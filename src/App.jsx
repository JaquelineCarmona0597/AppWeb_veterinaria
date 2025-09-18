import React, { useState } from 'react';
import Login from './components/auth/login';      // Asegúrate que la ruta sea correcta
import SignUp from './components/auth/SignUp';
import AdminPanel from './components/admin/adminpanel';     // Importa el nuevo componente
import './css/App.css';

function App() {
  const [isLoginPage, setIsLoginPage] = useState(true);

  // Funciones para cambiar entre vistas
  const navigateToSignUp = () => setIsLoginPage(false);
  const navigateToLogin = () => setIsLoginPage(true);

  return (
    <div className="App">
{/*       {isLoginPage ? (
        <Login onNavigateToSignUp={navigateToSignUp} />
      ) : (
        <SignUp onNavigateToLogin={navigateToLogin} />
      )} */}
      <AdminPanel />
    </div>
  );
}

export default App;