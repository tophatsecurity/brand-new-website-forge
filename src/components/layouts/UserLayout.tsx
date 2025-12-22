import React, { ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import Footer from '@/components/Footer';

interface UserLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

/**
 * Layout component for authenticated user pages with left sidebar navigation
 */
const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  title,
  className = '',
}) => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b bg-card flex items-center px-6 shrink-0">
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png"
            alt="TopHat Security Logo"
            className="h-10 mr-2"
          />
          <span className="text-xl font-bold whitespace-nowrap">
            <span className="text-foreground">TOPHAT</span>
            <span className="text-[#cc0c1a]">|SECURITY</span>
          </span>
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <UserSidebar />

        {/* Main Content */}
        <main className={`flex-1 overflow-auto ${className}`}>
          <div className="p-6">
            {title && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
