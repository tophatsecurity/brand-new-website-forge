
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import AdminNav from './navbar/AdminNav';
import SecondaryNav from './navbar/SecondaryNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavLink, getSecondaryNavLinks } from './NavLinks';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [isOverlapping, setIsOverlapping] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

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
        
        setIsOverlapping(combined > containerWidth);
        
        // Check if nav items are overflowing
        if (navRef.current) {
          const navItems = navRef.current.querySelectorAll('.nav-item');
          let totalWidth = 0;
          navItems.forEach((item) => {
            totalWidth += (item as HTMLElement).offsetWidth;
          });
          
          // Add some margin space
          totalWidth += (navItems.length - 1) * 24;
          
          // Check if content width exceeds container width
          setHasOverflow(totalWidth > navRef.current.offsetWidth);
        }
      }
    };
    
    checkOverlap();
    
    // Recheck on resize
    window.addEventListener('resize', checkOverlap);
    return () => {
      window.removeEventListener('resize', checkOverlap);
    };
  }, []);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    console.log("Role changed to:", role);
  };

  // Get the secondary navigation links
  const secondaryLinks = getSecondaryNavLinks();

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
            
            {/* Mobile Navigation - Only show toggle button next to logo on mobile */}
            {(isMobile || isOverlapping) && (
              <MobileNav 
                user={user}
                signOut={signOut}
                isAdmin={isAdmin}
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
            )}
          </div>

          {/* Desktop Navigation - show as normal on desktop */}
          {!isOverlapping && !isMobile && (
            <div ref={navRef} className="hidden md:block">
              <DesktopNav 
                user={user}
                signOut={signOut}
                isAdmin={isAdmin}
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
                hasOverflow={hasOverflow}
              />
            </div>
          )}
        </div>
        
        {/* Secondary Nav Row - Always display on desktop (not mobile) when there's space */}
        {!isMobile && !isOverlapping && (
          <div className="mt-3 pt-2 border-t border-border-dark/10 hidden md:block">
            <div className="flex justify-center">
              <ScrollArea className="w-full max-w-3xl">
                <div className="flex items-center space-x-6 px-2 justify-center">
                  {secondaryLinks.map((link) => (
                    <NavLink 
                      key={link.name} 
                      name={link.name} 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
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
