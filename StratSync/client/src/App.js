import React from 'react';
import './App.css';

function App() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <img 
          src="StratSync/client/assets/images/StratSync(Sin_fondo).png" 
          alt="StratSync Logo" 
          style={{width: '200px', marginBottom: '20px'}}
        />
        <h1 style={{color: '#260cb8'}}>Código de Acceso</h1>
        
        <form style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div>
            <label>Usuario:</label>
            <input type="text" style={{padding: '8px', width: '100%'}} />
          </div>
          <button style={{
            background: '#260cb8', 
            color: 'white', 
            padding: '10px',
            border: 'none',
            borderRadius: '5px'
          }}>
            Login
          </button>
        </form>
        
        <button style={{
          background: 'none',
          border: 'none',
          color: '#260cb8',
          marginTop: '15px',
          textDecoration: 'underline'
        }}>
          Modo Administrador
        </button>
      </div>
    </div>
  );
}

export default App;