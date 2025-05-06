
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
      "w-full backdrop-blur-md border-b transition-all duration-300",
      "bg-gray-100/90 dark:bg-gray-800/90",
      className
    )}>
      <div className="flex items-center justify-between py-3 px-6 md:px-12 lg:px-24 overflow-x-auto">
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mr-4">Admin:</div>
        <AdminNavLinks className="flex-grow" />
      </div>
    </div>
  );
};

export default AdminNav;
