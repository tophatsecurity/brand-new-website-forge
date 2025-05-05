
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink, getNavLinks } from './NavLinks';
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

// Import all required icons
import { 
  Users, 
  FileText, 
  Shield, 
  Download, 
  Settings, 
  BadgeHelp, 
  LayoutDashboard,
  ActivitySquare
} from 'lucide-react';

interface MobileNavProps {
  user: any;
  signOut: () => Promise<void>;
}

// Helper to convert icon string to component
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Users': <Users className="h-4 w-4 mr-2" />,
    'Settings': <Settings className="h-4 w-4 mr-2" />,
    'Shield': <Shield className="h-4 w-4 mr-2" />,
    'Download': <Download className="h-4 w-4 mr-2" />,
    'FileText': <FileText className="h-4 w-4 mr-2" />,
    'BadgeHelp': <BadgeHelp className="h-4 w-4 mr-2" />,
    'LayoutDashboard': <LayoutDashboard className="h-4 w-4 mr-2" />,
    'ActivitySquare': <ActivitySquare className="h-4 w-4 mr-2" />
  };
  
  return iconMap[iconName] || <FileText className="h-4 w-4 mr-2" />;
};

type AdminNavItem = {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
  display_order: number;
}

const MobileNav: React.FC<MobileNavProps> = ({ user, signOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminNavItems, setAdminNavItems] = useState<AdminNavItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  React.useEffect(() => {
    const fetchAdminNavItems = async () => {
      if (isAdmin) {
        try {
          const { data, error } = await supabase
            .from('admin_navigation')
            .select('*')
            .order('display_order', { ascending: true });
            
          if (error) {
            console.error('Error fetching admin navigation:', error);
          } else {
            setAdminNavItems(data || []);
          }
        } catch (err) {
          console.error('Exception fetching admin navigation:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchAdminNavItems();
  }, [isAdmin]);

  // Define predefined admin pages
  const predefinedAdminLinks = [
    { name: "Admin Dashboard", route: "/admin", icon: "LayoutDashboard" },
    { name: "Users", route: "/admin/users", icon: "Users" },
    { name: "Actions", route: "/admin/actions", icon: "ActivitySquare" },
    { name: "Permissions", route: "/admin/permissions", icon: "Shield" },
    { name: "Downloads", route: "/admin/downloads", icon: "Download" },
    { name: "Licensing", route: "/admin/licensing", icon: "FileText" },
  ];

  // Combine predefined and dynamic admin links, but avoid duplicates
  const allAdminItems = [...predefinedAdminLinks];
  
  // Only add dynamic links if they don't already exist in predefined links
  adminNavItems.forEach(dynamicItem => {
    const exists = allAdminItems.some(item => item.route === dynamicItem.route);
    if (!exists) {
      allAdminItems.push({
        name: dynamicItem.title,
        route: dynamicItem.route,
        icon: dynamicItem.icon
      });
    }
  });

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
          {isAdmin && !loading && (
            <>
              <Separator className="my-2" />
              <div className="pt-2 pb-1 font-semibold text-gray-500 dark:text-gray-400">
                Admin
              </div>
              
              {allAdminItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.route}
                  className={cn(
                    "font-medium py-2 flex items-center",
                    location.pathname === item.route
                      ? "text-[#cc0c1a] dark:text-[#cc0c1a]"
                      : "text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a]"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {getIconComponent(item.icon)} {item.name}
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
