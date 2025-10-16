import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Asegúrate que la ruta a firebase.js sea correcta

// 1. Se crea el contexto
export const AuthContext = createContext();

// 2. Se crea el Hook personalizado para no tener que importar useContext en cada archivo
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Se crea el componente Proveedor que envolverá la aplicación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (user) => {
    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await fetchUserData(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    refreshUserData: fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};