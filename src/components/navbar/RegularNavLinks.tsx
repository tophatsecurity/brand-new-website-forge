
import React from 'react';
import { useLocation } from "react-router-dom";
import SecondaryNavLink from './SecondaryNavLink';
import { FileText, BadgeHelp, Download } from 'lucide-react';

export type RegularLink = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
};

interface RegularNavLinksProps {
  className?: string;
}

const RegularNavLinks: React.FC<RegularNavLinksProps> = ({ className }) => {
  const location = useLocation();
  
  // Define regular links for approved users
  const regularLinks: RegularLink[] = [
    { name: "Licensing", href: "/licensing", icon: FileText },
    { name: "Support", href: "/support", icon: BadgeHelp },
    { name: "Downloads", href: "/downloads", icon: Download },
  ];

  return (
    <div className={`flex items-center space-x-4 overflow-x-auto ${className}`}>
      {regularLinks.map((link) => (
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

export default RegularNavLinks;
