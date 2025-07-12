
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'patient' | 'professional' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { isAuthenticated, userType, hasValidSession, refreshSession } = useAuth();

  useEffect(() => {
    // Verifica sessão ao acessar rota protegida
    if (!isAuthenticated) {
      refreshSession();
    }
  }, [isAuthenticated, refreshSession]);

  // Verifica se há sessão válida
  if (!hasValidSession()) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // Redireciona para dashboard apropriado se o usuário está logado mas no tipo errado
    if (userType === 'patient') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (userType === 'professional') {
      return <Navigate to="/professional-dashboard" replace />;
    } else if (userType === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
