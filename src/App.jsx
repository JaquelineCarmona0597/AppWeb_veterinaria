// App.jsx

import React from 'react';
import './css/App.css'
import './css/authCss/Login.css'
import AppRouter from './components/routes/AppRouter'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 


function App() {
  console.log("2. App.jsx se está renderizando");
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;