
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NavLink, getPrimaryNavLinks, NavigationLinkType } from './NavLinks';
import RoleSwitcher from './RoleSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import UserNavMenu from '@/components/UserNavMenu';
import {
  NavigationMenu,
  NavigationMenuList
} from "@/components/ui/navigation-menu";

interface DesktopNavProps {
  user: any;
  signOut: () => Promise<void>;
  isAdmin?: boolean;
  selectedRole?: string | null;
  onRoleChange?: (role: string) => void;
  hasOverflow?: boolean;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ 
  user, 
  signOut,
  isAdmin = false,
  selectedRole = null,
  onRoleChange = () => {},
  hasOverflow = false
}) => {
  const navigate = useNavigate();
  const primaryLinks = getPrimaryNavLinks();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      {/* Primary Navigation Links */}
      <div className="flex items-center space-x-6 mr-2">
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            {primaryLinks.map((link: NavigationLinkType) => (
              <NavLink 
                key={link.name} 
                name={link.name} 
                href={link.href} 
                className="nav-item" 
                hasDropdown={link.hasDropdown}
                dropdownItems={link.dropdownItems}
              />
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* User menu, role switcher, and theme toggle */}
      <div className="flex items-center space-x-3">
        {user && (
          <>
            {/* Role Switcher - only for admin users */}
            {isAdmin && (
              <RoleSwitcher 
                selectedRole={selectedRole} 
                onRoleChange={onRoleChange} 
              />
            )}
            
            {/* User email and avatar */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden lg:inline max-w-[200px] truncate">
                {user.email}
              </span>
              <UserNavMenu user={user} signOut={signOut} isAdmin={isAdmin} />
            </div>
          </>
        )}
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Login button only for non-authenticated users */}
        {!user && (
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Log in
          </Button>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
