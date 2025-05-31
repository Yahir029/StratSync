import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy loading para mejor performance
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const AdminLoginPage = lazy(() => import('./pages/public/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/private/DashboardPage'));
const SubjectsPage = lazy(() => import('./pages/private/SubjectsPage'));
const TeachersPage = lazy(() => import('./pages/private/TeachersPage'));
const SchedulePage = lazy(() => import('./pages/private/SchedulePage'));
const ReportsPage = lazy(() => import('./pages/private/ReportsPage'));

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        {/* Ruta raíz - redirige según autenticación */}
        <Route 
          path="/" 
          element={
            <Navigate to="/login" replace />
          } 
        />

        {/* Rutas públicas (solo para no autenticados) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/admin-login" 
          element={
            <PublicRoute>
              <AdminLoginPage />
            </PublicRoute>
          } 
        />

        {/* Rutas privadas */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/subjects" 
          element={
            <PrivateRoute>
              <SubjectsPage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/teachers" 
          element={
            <PrivateRoute>
              <TeachersPage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/schedule" 
          element={
            <PrivateRoute>
              <SchedulePage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/reports" 
          element={
            <PrivateRoute adminOnly>
              <ReportsPage />
            </PrivateRoute>
          } 
        />

        {/* Ruta comodín */}
        <Route 
          path="*" 
          element={
            <Navigate to="/dashboard" replace />
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;