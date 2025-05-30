import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/header.css';
import { stratSyncLogo } from '../../assets/images'; // Importación corregida

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="strat-sync-header">
      <div className="header-logo">
        <img 
          src={stratSyncLogo}  // Usamos el nombre que sabemos que funciona
          alt="StratSync Logo" 
          className="logo"
        />
        <h1>StratSync - Gestión de Horarios</h1>
      </div>
      
      {user && (
        <div className="header-user">
          <span className="user-greeting">Hola, {user.username}</span>
          <button className="logout-btn" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;