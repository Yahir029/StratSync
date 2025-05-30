import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import '../../assets/styles/auth.css';

const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleAdminLogin = async (username, password) => {
    try {
      await adminLogin(username, password);
    } catch (err) {
      setError('Credenciales de administrador inválidas');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img 
          src="/assets/images/StratSync(Sin_fondo).png" 
          alt="StratSync Logo" 
          className="auth-logo"
        />
        <h1 className="auth-title">Acceso Administrador</h1>
        
        <LoginForm isAdmin onSubmit={handleAdminLogin} />
        
        {error && <p className="auth-error">{error}</p>}
        
        <button 
          className="auth-switch-btn"
          onClick={() => navigate('/login')}
        >
          Modo Usuario Normal
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;