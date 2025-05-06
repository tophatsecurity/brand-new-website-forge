
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import ThemeToggle from './ThemeToggle';
import SecondaryNav from './navbar/SecondaryNav';
import AdminNav from './navbar/AdminNav';
import UserNavMenu from './UserNavMenu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ChevronDown, Shield, User } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

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

  // For debugging
  console.log("Navbar state:", { isAdmin, selectedRole, user: !!user });

  // Show appropriate navigation based on role
  const renderNavigation = () => {
    if (!user) return null;
    
    if (isAdmin && selectedRole === 'admin') {
      return (
        <AdminNav user={user} className={cn(scrolled ? "shadow-sm" : "", "z-30")} />
      );
    } else {
      return (
        <SecondaryNav 
          user={user} 
          className={cn(scrolled ? "shadow-sm" : "", "z-40")} 
          isAdmin={isAdmin}
          selectedRole={selectedRole}
        />
      );
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    console.log("Role changed to:", role);
  };

  // Role Switcher Component in the top bar
  const TopBarRoleSwitcher = () => {
    if (!user || !isAdmin) return null;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 ml-2">
            {selectedRole === 'admin' ? (
              <Shield className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
            <span className="capitalize">{selectedRole}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuRadioGroup value={selectedRole || undefined} onValueChange={handleRoleChange}>
            <DropdownMenuRadioItem value="admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="user" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>User</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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

          {/* Role Switcher in Top Bar for Medium Screens and Up */}
          <div className="hidden md:flex items-center">
            <TopBarRoleSwitcher />
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
          <div className="md:hidden flex items-center">
            <TopBarRoleSwitcher />
            <ThemeToggle className="mr-2" />
            <MobileNav 
              user={user} 
              signOut={signOut} 
              isAdmin={isAdmin} 
              selectedRole={selectedRole} 
              onRoleChange={handleRoleChange} 
            />
          </div>
        </div>
      </nav>
      
      {/* Conditionally render navigation based on role */}
      {renderNavigation()}
    </header>
  );
};

export default Navbar;
