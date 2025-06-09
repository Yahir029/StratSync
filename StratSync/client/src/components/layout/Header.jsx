import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/header.css';
import { stratSyncLogo } from '../../assets/images';

const Header = () => {
  const { user, logout } = useAuth();

// Aquí añadimos el console.log
  console.log('User en Header:', user);

  // Función para obtener el nombre a mostrar según el tipo de usuario
  const getDisplayName = () => {
    if (!user) return 'Usuario';
    
    // Usuario administrador
    if (user.role === 'admin') {
      return user.username || 'Administrador';
    }
    
    // Usuario profesor
    if (user.role === 'professor') {
      // Verificamos diferentes posibles estructuras de datos
      if (user.professor?.name) {
        return user.professor.name;
      }
      if (user.fullName) {
        return user.fullName;
      }
      return user.username || 'Profesor';
    }
    
    // Usuario estudiante u otros roles
    return user.username || 'Usuario';
  };

  return (
    <header className="strat-sync-header">
      <div className="header-logo">
        <img
          src={stratSyncLogo}
          alt="StratSync Logo"
          className="logo"
        />
        <h1>StratSync - Gestión de Horarios</h1>
      </div>
      
      {user && (
        <div className="header-user">
          <span className="user-greeting">Hola, {getDisplayName()}</span>
          <button className="logout-btn" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
