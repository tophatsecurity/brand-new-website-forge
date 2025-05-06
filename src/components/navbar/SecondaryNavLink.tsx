
import React from 'react';
import { Link } from "react-router-dom";
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
        "flex items-center text-sm font-medium transition-colors px-3 py-1.5 rounded-md whitespace-nowrap",
        active 
          ? "bg-background/70 text-foreground shadow-sm" 
          : "text-foreground/70 hover:text-foreground hover:bg-background/50",
        className
      )}
    >
      <Icon className="h-4 w-4 mr-2" />
      {name}
    </Link>
  );
};

export default SecondaryNavLink;
