import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy loading para mejor rendimiento
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const AdminLoginPage = lazy(() => import('./pages/public/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/private/DashboardPage'));
const SubjectsPage = lazy(() => import('./pages/private/SubjectsPage'));
const TeachersPage = lazy(() => import('./pages/private/TeachersPage'));
const SchedulePage = lazy(() => import('./pages/private/SchedulePage'));
const ReportsPage = lazy(() => import('./pages/private/ReportsPage'));

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !user?.isAdmin) return <Navigate to="/dashboard" />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Páginas privadas */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        
        <Route path="/subjects" element={
          <PrivateRoute>
            <SubjectsPage />
          </PrivateRoute>
        } />
        
        <Route path="/teachers" element={
          <PrivateRoute>
            <TeachersPage />
          </PrivateRoute>
        } />
        
        <Route path="/schedule" element={
          <PrivateRoute>
            <SchedulePage />
          </PrivateRoute>
        } />
        
        <Route path="/reports" element={
          <PrivateRoute adminOnly>
            <ReportsPage />
          </PrivateRoute>
        } />
        
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;