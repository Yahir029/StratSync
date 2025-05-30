import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import '../../assets/styles/auth.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (username) => {
    try {
      await login(username);
    } catch (err) {
      setError('Credenciales inválidas. Por favor intente nuevamente.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img 
          src="StratSync/client/assets/images/strat-sync-logo.png" 
          alt="StratSync Logo" 
          className="auth-logo"
        />
        <h1 className="auth-title">Código de Acceso</h1>
        
        <LoginForm onSubmit={handleLogin} />
        
        {error && <p className="auth-error">{error}</p>}
        
        <button 
          className="auth-switch-btn"
          onClick={() => navigate('/admin-login')}
        >
          Modo Administrador
        </button>
      </div>
    </div>
  );
};

export default LoginPage;