
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';
import { NavLink, getNavLinks } from './NavLinks';
import { Separator } from "@/components/ui/separator";
import MobileAdminLinks from './mobile/MobileAdminLinks';
import MobileUserResources from './mobile/MobileUserResources';
import RoleSwitcher from './RoleSwitcher';

interface MobileMenuContentProps {
  user: any;
  signOut: () => Promise<void>;
  isAdmin?: boolean;
  selectedRole?: string | null;
  onRoleChange?: (role: string) => void;
  onClose: () => void;
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({
  user,
  signOut,
  isAdmin = false,
  selectedRole = null,
  onRoleChange = () => {},
  onClose
}) => {
  const navigate = useNavigate();
  const navLinks = getNavLinks(user);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    onClose();
  };

  const isApproved = user?.user_metadata?.approved;
  const userEmail = user?.email?.split('@')[0] || 'Account';

  return (
    <div className="flex flex-col space-y-4 px-6">
      {/* Primary navigation links */}
      {navLinks.map((link) => (
        <NavLink 
          key={link.name}
          name={link.name}
          href={link.href}
          onClick={onClose}
        />
      ))}

      <Separator className="my-2" />

      {user ? (
        <>
          {/* User account info */}
          <div className="flex items-center space-x-2 py-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{userEmail}</span>
          </div>

          {/* Role Switcher for Admins */}
          {isAdmin && (
            <div className="py-2">
              <RoleSwitcher selectedRole={selectedRole} onRoleChange={onRoleChange} />
            </div>
          )}

          {/* User resources section for approved users */}
          {isApproved && (selectedRole === 'user' || !isAdmin) && (
            <MobileUserResources onClose={onClose} />
          )}

          {/* Admin sections for mobile */}
          {isAdmin && selectedRole === 'admin' && (
            <MobileAdminLinks onClose={onClose} />
          )}

          <Link
            to="/profile"
            className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2"
            onClick={onClose}
          >
            My Account
          </Link>
          <Button
            variant="outline"
            className="justify-start px-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2"
            onClick={onClose}
          >
            Login
          </Link>
          <Button
            className="bg-[#cc0c1a] hover:bg-[#a80916] text-white w-full"
            onClick={() => {
              navigate('/register');
              onClose();
            }}
          >
            Register
          </Button>
        </>
      )}
    </div>
  );
};

export default MobileMenuContent;
