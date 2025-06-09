import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import stratSyncLogo from '../../assets/images/strat-sync-logo.png';
import styles from '../../assets/styles/Login.module.css';

const LoginPage = () => {
  const [codigoAcceso, setCodigoAcceso] = useState('');
  const [error, setError] = useState('');
  const { teacherLogin } = useAuth(); // ← login desde el contexto
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await teacherLogin(codigoAcceso); // ← login real
      // la navegación se hace dentro del contexto
    } catch (err) {
      setError('Credenciales inválidas. Por favor intente nuevamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={stratSyncLogo} alt="StratSync Logo" className={styles.logo} />
        <h1 className={styles.title}>Código de Acceso Maestro</h1>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="codigoAcceso" className="sr-only">Código de Acceso</label>
            <input
              id="codigoAcceso"
              type="text"
              value={codigoAcceso}
              onChange={(e) => setCodigoAcceso(e.target.value)}
              className={styles.input}
              required
              placeholder="Ingrese su código"
            />
          </div>

          <button type="submit" className={styles.button}>Ingresar</button>
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
