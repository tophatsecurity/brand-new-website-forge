
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink, getNavLinks } from './NavLinks';
import { Separator } from "@/components/ui/separator";
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import { getIconComponent } from './IconRegistry';

// Import all required icons
import { 
  FileText, 
  BadgeHelp, 
  Download
} from 'lucide-react';

interface MobileNavProps {
  user: any;
  signOut: () => Promise<void>;
}

const MobileNav: React.FC<MobileNavProps> = ({ user, signOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navLinks = getNavLinks(user);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const isAdmin = user?.user_metadata?.role === 'admin';
  const isApproved = user?.user_metadata?.approved;
  
  // Use the shared admin navigation hook
  const { adminLinks } = useAdminNavigation(isAdmin);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "md:hidden absolute left-0 right-0 bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-50",
        isOpen ? "max-h-screen py-4" : "max-h-0"
      )}>
        <div className="flex flex-col space-y-4 px-6">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name}
              name={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
            />
          ))}

          {/* Resources section for approved users */}
          {isApproved && (
            <>
              <Separator className="my-2" />
              <div className="pt-2 pb-1 font-semibold text-gray-500 dark:text-gray-400">
                Resources
              </div>
              <Link
                to="/licensing"
                className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <FileText className="h-4 w-4 mr-2" /> Licensing
              </Link>
              <Link
                to="/support"
                className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <BadgeHelp className="h-4 w-4 mr-2" /> Support
              </Link>
              <Link
                to="/downloads"
                className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <Download className="h-4 w-4 mr-2" /> Downloads
              </Link>
            </>
          )}

          {/* Admin section for mobile */}
          {isAdmin && (
            <>
              <Separator className="my-2" />
              <div className="pt-2 pb-1 font-semibold text-gray-500 dark:text-gray-400">
                Admin
              </div>
              
              {adminLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "font-medium py-2 flex items-center",
                    location.pathname === item.href
                      ? "text-[#cc0c1a] dark:text-[#cc0c1a]"
                      : "text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a]"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-2" /> {item.name}
                </Link>
              ))}
            </>
          )}

          {user ? (
            <>
              <Separator className="my-2" />
              <Link
                to="/profile"
                className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2"
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Button
                className="bg-[#cc0c1a] hover:bg-[#a80916] text-white w-full"
                onClick={() => {
                  navigate('/register');
                  setIsOpen(false);
                }}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
