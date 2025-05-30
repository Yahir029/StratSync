import React, { useState } from 'react';
import '../../assets/styles/auth.css';

const LoginForm = ({ isAdmin = false, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdmin) {
      onSubmit(username, password);
    } else {
      onSubmit(username);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
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