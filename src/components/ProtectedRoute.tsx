import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute = ({ redirectPath = '/login' }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Si está autenticado, mostrar el contenido de la ruta
  return <Outlet />;
};

export default ProtectedRoute; 