import { useContext } from 'react';
// Asegúrate de que esta importación apunte al nuevo archivo AuthContext.js
import { AuthContext } from './AuthContext';

export const useAuth = () => {
    return useContext(AuthContext);
};