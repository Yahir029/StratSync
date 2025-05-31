import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import md5 from 'md5';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminAttempts, setAdminAttempts] = useState(0);
  const navigate = useNavigate();

  // Credenciales de administrador (en producción esto debe venir de tu backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    passwordHash: md5('admin123') // Hash MD5 de 'admin123'
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('stratSyncUser');

      // Si no hay usuario almacenado, redirige inmediatamente al login
      if (!storedUser) {
        setLoading(false);
        redirectToLogin();
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        // Validación adicional del usuario almacenado
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.username) {
          setUser(parsedUser);
          // Si está en página de login y ya está autenticado, redirige al dashboard
          if (['/login', '/admin-login'].includes(window.location.pathname)) {
            navigate('/dashboard', { replace: true });
          }
        } else {
          throw new Error('Usuario inválido');
        }
      } catch (error) {
        console.error('Error al analizar usuario:', error);
        localStorage.removeItem('stratSyncUser');
        redirectToLogin();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const redirectToLogin = () => {
    if (!['/login', '/admin-login'].includes(window.location.pathname)) {
      navigate('/login', { replace: true });
    }
  };

  const login = async (username) => {
    const userData = { 
      username,
      isAdmin: false,
      token: 'simulated-token-normal' 
    };
    setUser(userData);
    localStorage.setItem('stratSyncUser', JSON.stringify(userData));
    navigate('/dashboard', { replace: true });
    return userData;
  };

  const adminLogin = async (username, password) => {
    if (adminAttempts >= 3) {
      throw new Error('Demasiados intentos. Espere 5 minutos');
    }

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
      navigate('/dashboard', { replace: true });
      return adminData;
    } else {
      setAdminAttempts(prev => prev + 1);
      throw new Error(`Credenciales inválidas. Intentos restantes: ${3 - adminAttempts}`);
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
        adminAttempts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);