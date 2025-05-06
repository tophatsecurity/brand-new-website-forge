
import React from 'react';
import { cn } from "@/lib/utils";
import RegularNavLinks from './RegularNavLinks';

interface SecondaryNavProps {
  user: any;
  className?: string;
  isAdmin?: boolean;
  selectedRole?: string | null;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ 
  user, 
  className, 
  isAdmin = false,
  selectedRole = null,
}) => {
  // Only show the secondary nav to approved users
  if (!user?.user_metadata?.approved) {
    return null;
  }
  
  // For debugging
  console.log("SecondaryNav rendered with:", { isAdmin, selectedRole });
  
  return (
    <div className={cn(
      "w-full border-b transition-all duration-300",
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
      className
    )}>
      <div className="flex items-center py-2 px-6 md:px-12 lg:px-24 overflow-x-auto">
        {(!isAdmin || (isAdmin && selectedRole === 'user')) && (
          <div className="text-sm font-semibold text-foreground/70 dark:text-foreground/70 mr-4">
            Features:
          </div>
        )}
        <RegularNavLinks className="flex-1" />
      </div>
    </div>
  );
};

export default SecondaryNav;
