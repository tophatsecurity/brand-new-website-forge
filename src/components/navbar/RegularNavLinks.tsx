
import React from 'react';
import NavLinkGroup, { NavLink } from './NavLinkGroup';
import { FileText, BadgeHelp, Download, Coins } from 'lucide-react';

interface RegularNavLinksProps {
  className?: string;
}

const RegularNavLinks: React.FC<RegularNavLinksProps> = ({ className }) => {
  // Define regular links for approved users
  const regularLinks: NavLink[] = [
    { name: "Licensing", href: "/licensing", icon: FileText },
    { name: "Credits", href: "/credits", icon: Coins },
    { name: "Support", href: "/support", icon: BadgeHelp },
    { name: "Downloads", href: "/downloads", icon: Download },
  ];

  return <NavLinkGroup links={regularLinks} className={className} />;
};

export default RegularNavLinks;
