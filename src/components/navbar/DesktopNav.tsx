
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from 'lucide-react';
import { NavLink, getNavLinks } from './NavLinks';

interface DesktopNavProps {
  user: any;
  signOut: () => Promise<void>;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ user, signOut }) => {
  const navigate = useNavigate();
  const navLinks = getNavLinks(user);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex items-center space-x-8">
      {navLinks.map((link) => (
        <NavLink key={link.name} name={link.name} href={link.href} />
      ))}

      {/* Authentication Buttons */}
      {user ? (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => navigate('/profile')}
          >
            <User className="h-4 w-4" />
            <span>{user.email?.split('@')[0] || 'Account'}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            aria-label="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            className="bg-[#cc0c1a] hover:bg-[#a80916] text-white"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      )}
    </div>
  );
};

export default DesktopNav;
