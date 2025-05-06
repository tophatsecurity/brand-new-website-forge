
import React from 'react';
import NavLinkGroup from './NavLinkGroup';
import { type NavLink } from './NavLinkGroup';

interface AdminNavLinksProps {
  className?: string;
  links: NavLink[];
  actionButton?: React.ReactNode;
}

const AdminNavLinks: React.FC<AdminNavLinksProps> = ({ className, links, actionButton }) => {
  return (
    <div className={`${className} overflow-x-auto whitespace-nowrap pr-4 flex justify-between`}>
      <NavLinkGroup links={links} className="flex" />
      {actionButton && (
        <div className="ml-auto pl-4">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default AdminNavLinks;
