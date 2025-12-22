import React, { ReactNode } from 'react';
import PortalLayout from './PortalLayout';

interface UserLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

/**
 * Layout component for authenticated user pages
 * Now uses the unified PortalLayout with role-based sidebar
 */
const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <PortalLayout title={title} className={className}>
      {children}
    </PortalLayout>
  );
};

export default UserLayout;
