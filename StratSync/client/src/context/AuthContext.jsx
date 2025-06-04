import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginAdmin } from '../services/authService';

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

  const login = async (username) => {
    try {
      const response = await loginUser(username);
      const userData = {
        username: response.user.username,
        isAdmin: false,
        token: response.token,
      };
      setUser(userData);
      localStorage.setItem('stratSyncUser', JSON.stringify(userData));
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const adminLogin = async (username, password) => {
    if (adminAttempts >= 3) {
      throw new Error('Demasiados intentos. Espere 5 minutos');
    }

    try {
      const response = await loginAdmin(username, password);
      const adminData = {
        username: response.user.username,
        isAdmin: true,
        token: response.token,
      };
      setUser(adminData);
      localStorage.setItem('stratSyncUser', JSON.stringify(adminData));
      setAdminAttempts(0);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setAdminAttempts(prev => prev + 1);
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
        login,
        adminLogin,
        logout,
        adminAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);