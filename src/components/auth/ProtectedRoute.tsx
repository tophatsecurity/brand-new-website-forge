
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

  // Debug user and metadata
  console.log("User in ProtectedRoute:", user);
  console.log("User metadata in ProtectedRoute:", user.user_metadata);

  // Check if user is approved (if required)
  if (requireApproval && user.user_metadata?.approved !== true) {
    return <Navigate to="/pending-approval" state={{ from: location }} replace />;
  }

  // TEMPORARY: Skip admin check for debugging - remove this in production
  if (requireAdmin) {
    console.log("Admin page requested - temporarily allowing access for debugging");
    // Comment out the check to allow everyone to see admin pages during debugging
    // if (user.user_metadata?.role !== 'admin') {
    //   console.log("Access denied: User is not an admin", user.user_metadata);
    //   return <Navigate to="/" state={{ from: location }} replace />;
    // }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
