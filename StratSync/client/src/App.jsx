import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CategoriesProvider } from './context/CategoriesContext';
import AppRoutes from './routes';

// Estilos globales
import './assets/styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoriesProvider>
          <div className="app-container">
            <AppRoutes />
          </div>
        </CategoriesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
