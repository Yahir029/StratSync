import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaUser } from 'react-icons/fa';
import styles from '../../assets/styles/Login.module.css';
import stratSyncLogo from '../../assets/images/strat-sync-logo.png';

const AdminLoginPage = () => {
  const { adminLogin, adminAttempts } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [timeout, setTimeout] = useState(false);

  useEffect(() => {
    if (adminAttempts >= 3) {
      setTimeout(true);
      const timer = setTimeout(() => {
        setTimeout(false);
      }, 300000); // 5 minutos
      return () => clearTimeout(timer);
    }
  }, [adminAttempts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timeout) return;
    
    try {
      await adminLogin(username, password);
    } catch (err) {
      setError(err.message);
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
        <h1 className={styles.title}>Acceso Administrador</h1>
        
        {timeout ? (
          <div className={styles.timeoutMessage}>
            <FaLock className={styles.timeoutIcon} />
            <p>Demasiados intentos fallidos</p>
            <p>Por favor espere 5 minutos</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Usuario Admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
              disabled={adminAttempts >= 3}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              disabled={adminAttempts >= 3}
            />
            <button 
              type="submit" 
              className={styles.button}
              disabled={adminAttempts >= 3}
            >
              Ingresar como Admin
            </button>
          </form>
        )}
        
        {error && !timeout && <p className={styles.error}>{error}</p>}
        
        <button 
          className={styles.switchButton}
          onClick={() => navigate('/login')}
        >
          <FaUser /> Modo Usuario Normal
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;