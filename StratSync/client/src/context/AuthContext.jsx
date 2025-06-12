import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin as loginAdminService, teacherLogin as loginTeacherService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // puede ser admin o teacher
  const [loading, setLoading] = useState(true);
  const [adminAttempts, setAdminAttempts] = useState(0);
  const [teacherAttempts, setTeacherAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('stratSyncUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login administrador
  const handleAdminLogin = async (username, password) => {
    if (adminAttempts >= 3) {
      throw new Error('Demasiados intentos. Espere 5 minutos');
    }

    try {
      const response = await loginAdminService(username, password);
      const adminData = {
        username: response.username,
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

  // Login profesor
  const handleTeacherLogin = async (codigoAcceso) => {
    if (teacherAttempts >= 3) {
      throw new Error('Demasiados intentos. Espere 5 minutos');
    }

    try {
      const response = await loginTeacherService(codigoAcceso);
     const teacherData = {
  id: response.teacher.id,
  nombre: response.teacher.nombre,
  isAdmin: false,
  token: response.token || null,
};
      setUser(teacherData);
      localStorage.setItem('stratSyncUser', JSON.stringify(teacherData));
      setTeacherAttempts(0);
      navigate('/teacher-schedule', { replace: true }); // ruta ejemplo para profesor
    } catch (err) {
      setTeacherAttempts((prev) => prev + 1);
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
        teacherLogin: handleTeacherLogin,
        logout,
        adminAttempts,
        teacherAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
