import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { loginUser, loginAdmin } from '../../services/authService';
import '../../assets/styles/auth.css';

const LoginForm = ({ isAdmin = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = isAdmin 
        ? await loginAdmin(username, password)
        : await loginUser(username);
      
      localStorage.setItem('authToken', response.token);
      setAuth({
        isAuthenticated: true,
        user: response.user
      });
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      {isAdmin && (
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}
      
      <button type="submit" className="auth-submit-btn">
        {isAdmin ? 'Acceder como Admin' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default LoginForm;