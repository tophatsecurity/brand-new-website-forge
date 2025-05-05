
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';

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
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12 lg:px-24",
      scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
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
            <div>
              <span className="block text-2xl font-bold text-[#222]">THS</span>
              <span className="block text-lg font-bold text-[#cc0c1a]">|WEB</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav user={user} signOut={signOut} />
        
        {/* Mobile Navigation */}
        <MobileNav user={user} signOut={signOut} />
      </div>
    </nav>
  );
};

export default Navbar;
