
import React, { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  const getPaddingTopClass = () => {
    switch (paddingTop) {
      case 'none': return 'pt-0';
      case 'small': return 'pt-20';
      case 'large': return 'pt-40';
      default: return 'pt-32';
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <Navbar />
      <main className={`${getPaddingTopClass()} pb-16 ${fullWidth ? '' : 'px-6'}`}>
        <div className={`${fullWidth ? 'w-full' : 'container mx-auto'} ${containerClassName}`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
