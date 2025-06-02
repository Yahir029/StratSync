import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CategoriesProvider } from './context/CategoriesContext'; // Importa el nuevo provider
import AppRoutes from './routes';
import './assets/styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoriesProvider> {/* Envuelve con el nuevo provider */}
          <div className="app-container">
            <AppRoutes />
          </div>
        </CategoriesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;