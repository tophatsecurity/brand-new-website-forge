
import React from 'react';
import { cn } from "@/lib/utils";
import RegularNavLinks from './RegularNavLinks';

interface SecondaryNavProps {
  user: any;
  className?: string;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ user, className }) => {
  // Only show the secondary nav to approved users
  if (!user?.user_metadata?.approved) {
    return null;
  }
  
  return (
    <div className={cn(
      "w-full border-b transition-all duration-300",
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
      className
    )}>
      <div className="flex items-center py-2 px-6 md:px-12 lg:px-24 overflow-x-auto">
        <div className="text-sm font-semibold text-foreground/70 dark:text-foreground/70 mr-4">
          Features:
        </div>
        <RegularNavLinks className="flex-1" />
      </div>
    </div>
  );
};

export default SecondaryNav;
