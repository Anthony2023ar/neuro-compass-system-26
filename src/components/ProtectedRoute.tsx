import React from 'react';
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
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não há perfil, redirecionar para home
  if (!profile) {
    return <Navigate to="/" replace />;
  }

  // Se há um tipo específico requerido e não coincide
  if (requiredUserType && profile.user_type !== requiredUserType) {
    // Redireciona para dashboard apropriado se o usuário está logado mas no tipo errado
    if (profile.user_type === 'patient') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (profile.user_type === 'professional') {
      return <Navigate to="/professional-dashboard" replace />;
    } else if (profile.user_type === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;