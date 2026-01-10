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
  const [isTimeout, setIsTimeout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (adminAttempts >= 3) {
      setIsTimeout(true);
      const timer = setTimeout(() => {
        setIsTimeout(false);
      }, 300000); // 5 minutos
      return () => clearTimeout(timer);
    }
  }, [adminAttempts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isTimeout) return;

    setIsLoading(true);
    setError('');

    try {
      await adminLogin(username, password);
    } catch (err) {
      if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
        setError('Error de conexión con el servidor. Verifique su conexión o intente nuevamente.');
      } else {
        setError(err.message || 'Error de autenticación');
      }
    } finally {
      setIsLoading(false);
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

        {isTimeout ? (
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
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Ingresar como Admin'}
            </button>
          </form>
        )}

        {error && !isTimeout && (
          <div className={styles.error}>
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Reintentar conexión
            </button>
          </div>
        )}

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
