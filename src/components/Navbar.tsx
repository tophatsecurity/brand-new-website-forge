
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import AdminNav from './navbar/AdminNav';
import SecondaryNav from './navbar/SecondaryNav';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [isOverlapping, setIsOverlapping] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set default role when user loads or changes
    if (user) {
      if (isAdmin) {
        setSelectedRole('admin');
      } else {
        setSelectedRole('user');
      }
    } else {
      setSelectedRole(null);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check for overlap between logo and navbar
  useEffect(() => {
    const checkOverlap = () => {
      if (logoRef.current && navRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        
        // Check if logo width plus some padding is greater than available space
        const containerWidth = document.querySelector('nav')?.clientWidth || window.innerWidth;
        const combined = logoRect.width + navRect.width + 24; // 24px for padding
        
        // Always set to true on mobile for consistent vertical layout
        setIsOverlapping(isMobile || combined > containerWidth);
      }
    };
    
    checkOverlap();
    
    // Recheck on resize
    window.addEventListener('resize', checkOverlap);
    return () => {
      window.removeEventListener('resize', checkOverlap);
    };
  }, [isMobile]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    console.log("Role changed to:", role);
  };

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className={cn(
        "w-full transition-all duration-300 py-4 px-6 md:px-12 lg:px-24",
        scrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md" 
          : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
      )}>
        <div className="flex flex-col space-y-4">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png"
                alt="TopHat Security Logo"
                className="h-12 md:h-14 lg:h-16 mr-2 md:mr-3"
              />
              <span className="text-xl md:text-2xl font-bold whitespace-nowrap">
                <span className="text-[#222] dark:text-white">TOPHAT</span>
                <span className="text-[#cc0c1a]">|SECURITY</span>
              </span>
            </Link>
            
            {/* Mobile Navigation toggle button */}
            {isMobile && (
              <MobileNav 
                user={user}
                signOut={signOut}
                isAdmin={isAdmin}
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
            )}
          </div>

          {/* Navigation section - always below logo */}
          <div ref={navRef} className="w-full flex justify-end">
            {!isMobile && (
              <DesktopNav 
                user={user}
                signOut={signOut}
                isAdmin={isAdmin}
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Admin Navigation */}
      {user && selectedRole === 'admin' && isAdmin && (
        <AdminNav user={user} className="z-30" />
      )}
      
      {/* User Features Navigation */}
      {user && (selectedRole === 'user' || !isAdmin) && user.user_metadata?.approved && (
        <SecondaryNav 
          user={user} 
          className="z-40" 
          isAdmin={isAdmin} 
          selectedRole={selectedRole} 
        />
      )}
    </header>
  );
};

export default Navbar;
