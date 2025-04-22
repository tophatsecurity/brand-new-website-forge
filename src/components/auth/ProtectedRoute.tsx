
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
}

const ProtectedRoute = ({ children, requireApproval = true }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is approved (if required)
  if (requireApproval && user.user_metadata?.approved !== true) {
    return <Navigate to="/pending-approval" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
