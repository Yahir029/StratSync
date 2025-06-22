import React from 'react'; // Eliminamos la importación de useEffect
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/header.css';
import { stratSyncLogo } from '../../assets/images';

const Header = () => {
  const { user, logout } = useAuth();

  // Función para obtener el saludo personalizado
  const getGreeting = () => {
    if (!user) return 'Usuario';
    
    if (user.isAdmin) {
      return 'Hola, Administrador';
    }
    
    // Si tenemos nombre y apellidos
    if (user.nombre && user.apellidos) {
      return `Hola, Profesor@ ${user.nombre.trim()} ${user.apellidos}`;
    }
    
    // Si solo tenemos nombre
    if (user.nombre) {
      return `Hola, Profesor@ ${user.nombre.trim()}`;
    }
    
    // Si solo tenemos apellidos
    if (user.apellidos) {
      return `Hola, Profesor@ ${user.apellidos}`;
    }
    
    // Si no tenemos nombre, usar ID como respaldo
    return `Hola, Profesor@ #${user.id}`;
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
          <span className={`user-greeting ${user.isAdmin ? 'admin' : ''}`}>
            {getGreeting()}
          </span>
          <button className="logout-btn" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;