
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import SecondaryNav from './navbar/SecondaryNav';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [isOverlapping, setIsOverlapping] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Check if we're on an admin page (sidebar handles navigation)
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for overlap between logo and navbar
  useEffect(() => {
    const checkOverlap = () => {
      if (logoRef.current && navRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        const containerWidth = document.querySelector('nav')?.clientWidth || window.innerWidth;
        const combined = logoRect.width + navRect.width + 24;
        setIsOverlapping(combined > containerWidth);
      }
    };
    
    checkOverlap();
    window.addEventListener('resize', checkOverlap);
    return () => window.removeEventListener('resize', checkOverlap);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className={cn(
        "w-full transition-all duration-300 py-4 px-6 md:px-12 lg:px-24",
        scrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md" 
          : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
      )}>
        <div className={cn(
          "flex flex-wrap md:flex-row md:items-center md:justify-between", 
          (isMobile || isOverlapping) ? "space-y-4" : ""
        )}>
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
            
            {/* Mobile Navigation */}
            {(isMobile || isOverlapping) && (
              <MobileNav 
                user={user}
                signOut={signOut}
                isAdmin={isAdmin}
              />
            )}
          </div>

          {/* Desktop Navigation */}
          {!isOverlapping && !isMobile && (
            <div ref={navRef} className="hidden md:block">
              <DesktopNav 
                user={user}
                signOut={signOut}
                isAdmin={isAdmin}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
