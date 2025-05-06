
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { NavLink, getNavLinks } from '../NavLinks';
import { Separator } from "@/components/ui/separator";
import MobileAdminLinks from './MobileAdminLinks';
import MobileUserResources from './MobileUserResources';
import RoleSwitcher from '../RoleSwitcher';

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

  return (
    <div className="flex flex-col space-y-4 px-6">
      {/* Role Switcher for Admins */}
      {user && isAdmin && (
        <div className="py-2">
          <RoleSwitcher selectedRole={selectedRole} onRoleChange={onRoleChange} />
        </div>
      )}
      
      {/* Primary navigation links */}
      {navLinks.map((link) => (
        <NavLink 
          key={link.name}
          name={link.name}
          href={link.href}
          onClick={onClose}
        />
      ))}

      {/* User resources section for approved users */}
      {isApproved && (selectedRole === 'user' || !isAdmin) && (
        <MobileUserResources onClose={onClose} />
      )}

      {/* Admin sections for mobile */}
      {isAdmin && selectedRole === 'admin' && (
        <MobileAdminLinks onClose={onClose} />
      )}

      {user ? (
        <>
          <Separator className="my-2" />
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
