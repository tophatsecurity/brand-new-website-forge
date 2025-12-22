import React, { ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PortalSidebar from './PortalSidebar';
import ThemeToggle from '@/components/ThemeToggle';

interface PortalLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

/**
 * Unified layout component for all authenticated user and admin pages
 * with left sidebar navigation organized by role
 */
const PortalLayout: React.FC<PortalLayoutProps> = ({
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
      <header className="h-16 border-b bg-card flex items-center px-6 shrink-0 justify-between">
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
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <PortalSidebar />

        {/* Main Content */}
        <main className={`flex-1 overflow-auto ${className}`}>
          <div className="p-6 max-w-7xl mx-auto">
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
