import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Sprawdzanie uprawnień...</div>;
  }

  return isAuthenticated ? <h1>Zapraszamy!</h1> : <Navigate to="/login" replace />;
};