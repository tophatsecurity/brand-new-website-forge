
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type SecondaryNavLinkProps = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  active?: boolean;
};

const SecondaryNavLink: React.FC<SecondaryNavLinkProps> = ({ name, href, icon: Icon, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center font-medium transition-colors px-4 py-2 rounded-md whitespace-nowrap",
        active 
          ? "text-[#cc0c1a] dark:text-[#cc0c1a]" 
          : "text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a]"
      )}
    >
      <Icon className="h-4 w-4 mr-3" />
      {name}
    </Link>
  );
};

export default SecondaryNavLink;
