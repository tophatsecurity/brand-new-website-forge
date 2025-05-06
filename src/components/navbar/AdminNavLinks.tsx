
import React from 'react';
import NavLinkGroup from './NavLinkGroup';
import { type NavLink } from './NavLinkGroup';

interface AdminNavLinksProps {
  className?: string;
  links: NavLink[];
}

const AdminNavLinks: React.FC<AdminNavLinksProps> = ({ className, links }) => {
  return (
    <div className={`${className} overflow-x-auto whitespace-nowrap pr-4`}>
      <NavLinkGroup links={links} className="flex" />
    </div>
  );
};

export default AdminNavLinks;
