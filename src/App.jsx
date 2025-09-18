// App.js

import React from 'react';
import './css/App.css';
import AppRouter from './components/routes/AppRouter'; // Importa el enrutador

function App() {
  // Ya no se necesita el estado para manejar qué página se muestra.
  // ¡El componente AppRouter se encarga de todo eso ahora!
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
