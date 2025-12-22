import React from 'react';
import PortalLayout from './PortalLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Layout component for admin pages
 * Now uses the unified PortalLayout with role-based sidebar
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <PortalLayout title={title}>
      {children}
    </PortalLayout>
  );
};

export default AdminLayout;
