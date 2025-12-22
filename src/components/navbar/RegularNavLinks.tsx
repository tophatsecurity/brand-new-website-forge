import React from 'react';
import NavLinkGroup, { NavLink } from './NavLinkGroup';
import { FileText, BookOpen, Download, Coins, HeadphonesIcon } from 'lucide-react';

interface RegularNavLinksProps {
  className?: string;
}

const RegularNavLinks: React.FC<RegularNavLinksProps> = ({ className }) => {
  // Define regular links for approved users
  const regularLinks: NavLink[] = [
    { name: "Licensing", href: "/licensing", icon: FileText },
    { name: "Credits", href: "/credits", icon: Coins },
    { name: "Knowledge Base", href: "/support", icon: BookOpen },
    { name: "Support", href: "/support/tickets", icon: HeadphonesIcon },
    { name: "Downloads", href: "/downloads", icon: Download },
  ];

  return <NavLinkGroup links={regularLinks} className={className} />;
};

export default RegularNavLinks;
