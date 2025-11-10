/*
  Permitir exportaciones que no sean componentes en este archivo para React Refresh.La regla de ESLint `react-refresh/only-export-components` puede ser estricta en monorrepos o al exportar hooks/contexto junto con componentes proveedores. Para evitar errores falsos de Fast Refresh durante el desarrollo, deshabilitamos la regla aquí. Si prefieres una configuración más estricta, mueve el contexto/hooks y el proveedor a archivos separados (recomendado para mantenimiento a largo plazo).*//* eslint-disable react-refresh/only-export-components*/

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Asegúrate que la ruta a firebase.js sea correcta

export const AuthContext = createContext();

// 2. Se crea el Hook personalizado
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Se crea el componente Proveedor
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos del usuario desde Firestore
  const fetchUserData = async (user) => {
    if (user) {
      // --- MEJORA: Combinar datos de Auth y Firestore ---
      const userDocRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        // Guardamos todo junto: la foto de Google (auth) y los datos de la BD (firestore)
        setUserData({
          photoURL: user.photoURL,
          ...docSnap.data(),
        });
      } else {
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await fetchUserData(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- CORRECCIÓN: Unimos todo en un solo objeto 'value' ---
  const value = {
    currentUser,
    userData,
    loading,
    logout, // Incluimos la función de logout
    refreshUserData: fetchUserData // Y la función para refrescar datos
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};