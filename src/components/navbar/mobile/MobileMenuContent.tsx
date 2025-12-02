
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { NavLink, getNavLinks, NavigationLinkType } from '../NavLinks';
import { Separator } from "@/components/ui/separator";
import MobileUserResources from './MobileUserResources';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

interface MobileMenuContentProps {
  user: any;
  signOut: () => Promise<void>;
  isAdmin?: boolean;
  onClose: () => void;
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({
  user,
  signOut,
  isAdmin = false,
  onClose
}) => {
  const navigate = useNavigate();
  const navLinks = getNavLinks();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    onClose();
  };

  const isApproved = user?.user_metadata?.approved;
  const userEmail = user?.email || 'Account';

  const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>({});

  const toggleCollapsible = (name: string) => {
    setOpenCollapsibles(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="flex flex-col space-y-4 px-6">
      {/* Primary navigation links */}
      {navLinks.map((link: NavigationLinkType) => (
        link.hasDropdown ? (
          <Collapsible 
            key={link.name}
            open={openCollapsibles[link.name]}
            onOpenChange={() => toggleCollapsible(link.name)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full font-medium text-foreground dark:text-white py-2">
              {link.name}
              {openCollapsibles[link.name] ? (
                <ChevronDown className="h-4 w-4 ml-1" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-1" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-1 pb-2 space-y-2">
              {link.dropdownItems?.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block font-medium text-muted-foreground hover:text-foreground py-1"
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <NavLink 
            key={link.name}
            name={link.name}
            href={link.href}
            onClick={onClose}
          />
        )
      ))}

      <Separator className="my-2" />

      {/* User account info */}
      {user ? (
        <>
          <div className="flex items-center space-x-2 py-2">
            <User className="h-4 w-4" />
            <span className="font-medium truncate">{userEmail}</span>
          </div>

          {/* User resources section for approved users */}
          {isApproved && (
            <MobileUserResources onClose={onClose} />
          )}

          {/* Admin Dashboard link for admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2"
              onClick={onClose}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Link>
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
        <Link
          to="/login"
          className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2"
          onClick={onClose}
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default MobileMenuContent;
