
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from './ThemeToggle';
import UserNavMenu from './UserNavMenu';
import { getNavLinks } from './navbar/NavLinks';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import AdminNav from './navbar/AdminNav';
import SecondaryNav from './navbar/SecondaryNav';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <DesktopNav 
            user={user}
            signOut={signOut}
            isAdmin={isAdmin}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
          />

          {/* Mobile Navigation */}
          <MobileNav
            user={user}
            signOut={signOut}
            isAdmin={isAdmin}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
          />
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
