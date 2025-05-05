
import React from 'react';
import { useLocation } from "react-router-dom";
import SecondaryNavLink from './SecondaryNavLink';
import { useAdminNavigation, AdminNavLink } from '@/hooks/useAdminNavigation';

interface AdminNavLinksProps {
  isAdmin: boolean;
  className?: string;
}

const AdminNavLinks: React.FC<AdminNavLinksProps> = ({ isAdmin, className }) => {
  const location = useLocation();
  const { adminLinks, loading } = useAdminNavigation(isAdmin);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-4 overflow-x-auto ${className}`}>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading admin...</div>
      ) : (
        adminLinks.map((link: AdminNavLink) => (
          <SecondaryNavLink 
            key={link.name} 
            name={link.name} 
            href={link.href} 
            icon={link.icon}
            active={location.pathname === link.href || 
                  (link.href !== "/" && location.pathname.startsWith(link.href))}
          />
        ))
      )}
    </div>
  );
};

export default AdminNavLinks;
