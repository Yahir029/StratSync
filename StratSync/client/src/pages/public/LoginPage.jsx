import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import stratSyncLogo from '../../assets/images/strat-sync-logo.png';
import styles from '../../assets/styles/Login.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Por favor intente nuevamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img 
          src={stratSyncLogo} 
          alt="StratSync Logo" 
          className={styles.logo}
        />
        
        <h1 className={styles.title}>Código de Acceso Maestro</h1>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username"></label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
              placeholder="Ingrese su codigo"
            />
          </div>
          
          <button type="submit" className={styles.button}>
            Ingresar
          </button>
        </form>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <button 
          className={styles.switchButton}
          onClick={() => navigate('/admin-login')}
        >
          ¿Eres administrador? Accede aquí
        </button>
      </div>
    </div>
  );
};

export default LoginPage;