import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProgramManagerRouteProps {
  children: React.ReactNode;
}

const ProgramManagerRoute: React.FC<ProgramManagerRouteProps> = ({ children }) => {
  const { user, isAdmin, userRoles, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
      variant: "destructive"
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin or program manager
  const isProgramManager = userRoles?.includes('program_manager');
  const hasAccess = isAdmin || isProgramManager;

  // Not an admin or program manager, redirect to home
  if (!hasAccess) {
    toast({
      title: "Access denied",
      description: "You don't have permission to access this area",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has access
  return <>{children}</>;
};

export default ProgramManagerRoute;
