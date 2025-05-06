
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type SecondaryNavLinkProps = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  active?: boolean;
  className?: string;
};

const SecondaryNavLink: React.FC<SecondaryNavLinkProps> = ({ 
  name, 
  href, 
  icon: Icon, 
  active,
  className
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center font-medium transition-colors px-4 py-2 rounded-md whitespace-nowrap",
        active 
          ? "text-primary dark:text-primary" 
          : "text-foreground dark:text-white hover:text-primary dark:hover:text-primary",
        className
      )}
    >
      <Icon className="h-4 w-4 mr-3" />
      {name}
    </Link>
  );
};

export default SecondaryNavLink;
