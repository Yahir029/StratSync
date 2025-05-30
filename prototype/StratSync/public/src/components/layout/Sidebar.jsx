import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: '🏠' },
    { path: '/schedule', label: 'Horarios', icon: '⏱️' },
    { path: '/teachers', label: 'Profesores', icon: '👨‍🏫' },
    { path: '/subjects', label: 'Materias', icon: '📚' },
  ];

  if (user?.isAdmin) {
    navItems.push(
      { path: '/reports', label: 'Reportes', icon: '📊' }
    );
  }

  return (
    <nav className="strat-sync-sidebar">
      <ul>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                isActive ? 'nav-item active' : 'nav-item'
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <p>StratSync v1.0</p>
        <p>Sistema de Gestión Académica</p>
      </div>
    </nav>
  );
};

export default Sidebar;