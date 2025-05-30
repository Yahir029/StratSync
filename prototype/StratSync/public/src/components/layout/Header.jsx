import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/header.css';

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="strat-sync-header">
      <div className="header-logo">
        <img 
          src="/assets/images/StratSync(Sin_fondo).png" 
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