
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from './ThemeToggle';
import UserNavMenu from './UserNavMenu';
import { getNavLinks, NavLink } from './navbar/NavLinks';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ChevronDown, Menu, Shield, User, X } from 'lucide-react';

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

  // Role Switcher Component
  const RoleSwitcher = () => {
    if (!user || !isAdmin) return null;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
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

  const navLinks = getNavLinks();

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
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink key={link.name} name={link.name} href={link.href} />
            ))}
          </div>

          {/* User Menu, Role Switcher, and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            {user && <RoleSwitcher />}
            <UserNavMenu />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && <RoleSwitcher />}
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed left-0 right-0 top-[72px] bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-50",
        mobileMenuOpen ? "max-h-screen py-4" : "max-h-0"
      )}>
        {mobileMenuOpen && (
          <div className="flex flex-col space-y-4 px-6">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name}
                name={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
            
            {!user && (
              <>
                <Link
                  to="/login"
                  className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Button
                  className="bg-[#cc0c1a] hover:bg-[#a80916] text-white w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = '/register';
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Conditionally render secondary navigation */}
      {user && selectedRole === 'admin' && isAdmin && (
        <div className={cn(
          "w-full border-b transition-all duration-300",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm",
          "z-30"
        )}>
          <div className="flex items-center py-2 px-6 md:px-12 lg:px-24 overflow-x-auto">
            <div className="text-sm font-semibold text-foreground/70 dark:text-foreground/70 mr-4">
              Admin:
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/admin" className="text-sm text-foreground dark:text-white hover:text-[#cc0c1a]">Dashboard</Link>
              <Link to="/admin/users" className="text-sm text-foreground dark:text-white hover:text-[#cc0c1a]">Users</Link>
              <Link to="/admin/licensing" className="text-sm text-foreground dark:text-white hover:text-[#cc0c1a]">Licensing</Link>
            </div>
          </div>
        </div>
      )}
      
      {user && (selectedRole === 'user' || !isAdmin) && user.user_metadata?.approved && (
        <div className={cn(
          "w-full border-b transition-all duration-300",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm",
          "z-40"
        )}>
          <div className="flex items-center py-2 px-6 md:px-12 lg:px-24 overflow-x-auto">
            <div className="text-sm font-semibold text-foreground/70 dark:text-foreground/70 mr-4">
              Features:
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/licensing" className="text-sm text-foreground dark:text-white hover:text-[#cc0c1a]">Licensing</Link>
              <Link to="/support" className="text-sm text-foreground dark:text-white hover:text-[#cc0c1a]">Support</Link>
              <Link to="/downloads" className="text-sm text-foreground dark:text-white hover:text-[#cc0c1a]">Downloads</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
