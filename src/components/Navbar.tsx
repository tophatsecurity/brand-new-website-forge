
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import ThemeToggle from './ThemeToggle';
import SecondaryNav from './navbar/SecondaryNav';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();

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

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className={cn(
        "w-full transition-all duration-300 py-4 px-6 md:px-12 lg:px-24",
        scrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md" 
          : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md"
      )}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png"
                alt="TopHat Security Logo"
                className="h-14 md:h-16 mr-3"
              />
              <span className="text-2xl font-bold">
                <span className="text-[#222] dark:text-white">THS</span>
                <span className="text-[#cc0c1a]">|WEB</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <DesktopNav user={user} signOut={signOut} />
            <ThemeToggle />
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <ThemeToggle className="mr-2" />
            <MobileNav user={user} signOut={signOut} />
          </div>
        </div>
      </nav>
      
      {/* Secondary Navigation Bar */}
      {user && <SecondaryNav user={user} className={scrolled ? "shadow-sm" : ""} />}
    </header>
  );
};

export default Navbar;
