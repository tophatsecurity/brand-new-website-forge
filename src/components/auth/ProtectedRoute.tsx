
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireApproval = true, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
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

  // Check if user is an admin (if required)
  if (requireAdmin && user.user_metadata?.role !== 'admin') {
    console.log("Access denied: User is not an admin", user.user_metadata);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
