
import React from 'react';
import NavLinkGroup, { NavLink } from './NavLinkGroup';
import { LayoutDashboard, Users, Shield, Key, Download, ActivitySquare } from 'lucide-react';

interface AdminNavLinksProps {
  className?: string;
}

const AdminNavLinks: React.FC<AdminNavLinksProps> = ({ className }) => {
  // Define admin links
  const adminLinks: NavLink[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Permissions", href: "/admin/permissions", icon: Shield },
    { name: "Actions", href: "/admin/actions", icon: ActivitySquare },
    { name: "Licensing", href: "/admin/licensing", icon: Key },
    { name: "Downloads", href: "/admin/downloads", icon: Download },
  ];

  return (
    <div className={`${className} overflow-x-auto whitespace-nowrap pr-4`}>
      <NavLinkGroup links={adminLinks} className="flex space-x-5" />
    </div>
  );
};

export default AdminNavLinks;
