
import React from 'react';
import { cn } from "@/lib/utils";
import AdminNavLinks from './AdminNavLinks';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';

interface AdminNavProps {
  user: any;
  className?: string;
}

const AdminNav: React.FC<AdminNavProps> = ({ user, className }) => {
  // Only show the admin nav to admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return null;
  }
  
  const isAdmin = user.user_metadata?.role === 'admin';
  const { adminLinks } = useAdminNavigation(isAdmin);
  
  return (
    <div className={cn(
      "w-full border-b transition-all duration-300",
      "bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center py-2 px-6 md:px-12 lg:px-24 overflow-x-auto">
        <div className="text-sm font-semibold text-foreground/70 dark:text-foreground/70 mr-4">
          Admin:
        </div>
        <AdminNavLinks className="flex-1" links={adminLinks} />
      </div>
    </div>
  );
};

export default AdminNav;
