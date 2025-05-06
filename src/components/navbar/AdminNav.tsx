
import React from 'react';
import { cn } from "@/lib/utils";
import AdminNavLinks from './AdminNavLinks';

interface AdminNavProps {
  user: any;
  className?: string;
}

const AdminNav: React.FC<AdminNavProps> = ({ user, className }) => {
  // Only show the admin nav to admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return null;
  }
  
  return (
    <div className={cn(
      "w-full border-b transition-all duration-300",
      "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md",
      className
    )}>
      <div className="flex items-center justify-start py-4 px-6 md:px-12 lg:px-24 overflow-x-auto">
        <div className="text-sm font-semibold text-primary dark:text-primary mr-4">Admin:</div>
        <AdminNavLinks className="flex-1" />
      </div>
    </div>
  );
};

export default AdminNav;
