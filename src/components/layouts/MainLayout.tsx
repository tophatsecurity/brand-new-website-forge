
import React, { ReactNode, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
  paddingTop?: 'default' | 'none' | 'small' | 'large';
}

/**
 * Main layout component for consistent page structure
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = '',
  containerClassName = '',
  fullWidth = false,
  paddingTop = 'default',
}) => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  const getPaddingTopClass = () => {
    switch (paddingTop) {
      case 'none': return 'pt-0';
      case 'small': return 'pt-16';
      case 'large': return 'pt-28';
      default: return 'pt-24';
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <Navbar />
      <main className={`${getPaddingTopClass()} pb-8 ${fullWidth ? '' : 'px-4'}`}>
        <div className={`${fullWidth ? 'w-full' : 'container mx-auto'} ${containerClassName}`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
