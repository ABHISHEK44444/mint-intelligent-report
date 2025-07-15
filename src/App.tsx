import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MainLayout from './components/layout/MainLayout';
import { Role } from './types';

const AppRoutes: React.FC = () => {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!auth?.currentUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!auth?.currentUser ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
      
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

      <Route path="*" element={<Navigate to={auth?.currentUser ? "/dashboard" : "/login"} />} />
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
