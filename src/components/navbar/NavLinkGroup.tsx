
import React from 'react';
import { useLocation } from "react-router-dom";
import SecondaryNavLink from './SecondaryNavLink';
import { cn } from "@/lib/utils";

export type NavLink = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
};

interface NavLinkGroupProps {
  links: NavLink[];
  className?: string;
}

const NavLinkGroup: React.FC<NavLinkGroupProps> = ({ links, className }) => {
  const location = useLocation();
  
  if (!links || links.length === 0) {
    return null;
  }
  
  return (
    <div className={cn("flex items-center space-x-8 overflow-x-auto", className)}>
      {links.map((link) => (
        <SecondaryNavLink 
          key={link.name} 
          name={link.name} 
          href={link.href} 
          icon={link.icon}
          active={location.pathname === link.href || 
                (link.href !== "/" && location.pathname.startsWith(link.href))}
        />
      ))}
    </div>
  );
};

export default NavLinkGroup;
