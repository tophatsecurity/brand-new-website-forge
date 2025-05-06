
import React from 'react';
import { cn } from "@/lib/utils";
import RegularNavLinks from './RegularNavLinks';
import AdminNavLinks from './AdminNavLinks';

interface SecondaryNavProps {
  user: any;
  className?: string;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ user, className }) => {
  // Only show the secondary nav to approved users
  if (!user?.user_metadata?.approved) {
    return null;
  }
  
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  return (
    <div className={cn(
      "w-full backdrop-blur-md border-b transition-all duration-300",
      "bg-white/70 dark:bg-gray-900/70",
      className
    )}>
      <div className="flex items-center justify-between py-4 px-6 md:px-12 lg:px-24 overflow-x-auto">
        {isAdmin ? <AdminNavLinks /> : <RegularNavLinks />}
      </div>
    </div>
  );
};

export default SecondaryNav;
