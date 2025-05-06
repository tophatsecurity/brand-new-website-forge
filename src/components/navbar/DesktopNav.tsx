
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NavLink, getNavLinks } from './NavLinks';
import RoleSwitcher from './RoleSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import UserNavMenu from '@/components/UserNavMenu';

interface DesktopNavProps {
  user: any;
  signOut: () => Promise<void>;
  isAdmin?: boolean;
  selectedRole?: string | null;
  onRoleChange?: (role: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ 
  user, 
  signOut,
  isAdmin = false,
  selectedRole = null,
  onRoleChange = () => {}
}) => {
  const navigate = useNavigate();
  const navLinks = getNavLinks();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      {/* Primary Navigation Links */}
      <div className="flex items-center space-x-6 mr-2">
        {navLinks.map((link) => (
          <NavLink key={link.name} name={link.name} href={link.href} />
        ))}
      </div>

      {/* User menu, role switcher, and theme toggle */}
      <div className="flex items-center space-x-2">
        {user && (
          <>
            {/* Role Switcher - only for admin users */}
            {isAdmin && (
              <RoleSwitcher 
                selectedRole={selectedRole} 
                onRoleChange={onRoleChange} 
              />
            )}
            
            {/* User Navigation Menu */}
            <UserNavMenu user={user} signOut={signOut} isAdmin={isAdmin} />
          </>
        )}
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Login/Register buttons for non-authenticated users */}
        {!user && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button onClick={() => navigate('/register')}>Sign up</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
