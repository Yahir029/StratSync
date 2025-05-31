import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminAttempts, setAdminAttempts] = useState(0);
  const navigate = useNavigate();

  // Datos de admin simulados (en producción esto viene del backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    passwordHash: '482c811da5d5b4bc6d497ffa98491e38' // md5 de 'admin123'
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('stratSyncUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('stratSyncUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username) => {
    const userData = { 
      username,
      isAdmin: false,
      token: 'simulated-token-normal' 
    };
    setUser(userData);
    localStorage.setItem('stratSyncUser', JSON.stringify(userData));
    navigate('/dashboard');
    return userData;
  };

  const adminLogin = async (username, password) => {
    if (adminAttempts >= 3) {
      throw new Error('Demasiados intentos. Espere 5 minutos');
    }

    // Simula el hash MD5 (instala md5 con: npm install md5)
    const md5 = require('md5');
    const isAdmin = (
      username === ADMIN_CREDENTIALS.username && 
      md5(password) === ADMIN_CREDENTIALS.passwordHash
    );

    if (isAdmin) {
      const adminData = {
        username,
        isAdmin: true,
        token: 'simulated-token-admin'
      };
      setUser(adminData);
      localStorage.setItem('stratSyncUser', JSON.stringify(adminData));
      setAdminAttempts(0);
      navigate('/dashboard');
      return adminData;
    } else {
      setAdminAttempts(prev => prev + 1);
      throw new Error(`Credenciales inválidas. Intentos restantes: ${3 - adminAttempts}`);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stratSyncUser');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        loading,
        login,
        adminLogin,
        logout,
        adminAttempts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);