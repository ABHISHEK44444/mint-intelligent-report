
import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import MainLayout from './components/layout/MainLayout';
import { Role } from './types';

const AppRoutes: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null; // Or a loading spinner
  }

  return (
    <Routes>
      <Route path="/login" element={!auth.currentUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout><DashboardPage /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute role={Role.ADMIN}>
          <MainLayout><AdminPage /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to={auth.currentUser ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: Role;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const auth = useContext(AuthContext);

  if (!auth?.currentUser) {
    return <Navigate to="/login" />;
  }
  if (role && auth.currentUser.role !== role) {
    return <Navigate to="/dashboard" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
