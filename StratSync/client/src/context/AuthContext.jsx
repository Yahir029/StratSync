import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin as loginAdminService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminAttempts, setAdminAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('stratSyncUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleAdminLogin = async (username, password) => {
    if (adminAttempts >= 3) {
      throw new Error('Demasiados intentos. Espere 5 minutos');
    }

    try {
      const response = await loginAdminService(username, password);
      const adminData = {
        username: response.username, // ← CORREGIDO
        isAdmin: true,
        token: response.token,
      };
      setUser(adminData);
      localStorage.setItem('stratSyncUser', JSON.stringify(adminData));
      setAdminAttempts(0);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setAdminAttempts((prev) => prev + 1);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stratSyncUser');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        loading,
        adminLogin: handleAdminLogin,
        logout,
        adminAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
