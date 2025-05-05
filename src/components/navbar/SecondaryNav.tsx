
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SecondaryNavLinkProps = {
  name: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

// Import all icons from lucide-react
import { 
  Users, 
  Settings, 
  Shield, 
  Download, 
  FileText, 
  BadgeHelp, 
  Wrench, 
  Database, 
  Key,
  LayoutDashboard,
  ActivitySquare
} from 'lucide-react';

// Helper to convert icon string to Lucide icon component
const getIconComponent = (iconName: string): LucideIcon => {
  // Map string names to actual imported icon components
  const iconMap: Record<string, LucideIcon> = {
    'Users': Users,
    'Settings': Settings,
    'Shield': Shield,
    'Download': Download,
    'FileText': FileText,
    'BadgeHelp': BadgeHelp,
    'Wrench': Wrench,
    'Database': Database,
    'Key': Key,
    'LayoutDashboard': LayoutDashboard,
    'ActivitySquare': ActivitySquare
  };
  
  return iconMap[iconName] || FileText;  // Default to FileText if icon not found
};

const SecondaryNavLink: React.FC<SecondaryNavLinkProps> = ({ name, href, icon: Icon, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center font-medium transition-colors px-2 py-1 rounded-md whitespace-nowrap",
        active 
          ? "text-[#cc0c1a] dark:text-[#cc0c1a]" 
          : "text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a]"
      )}
    >
      <Icon className="h-4 w-4 mr-1" />
      {name}
    </Link>
  );
};

interface SecondaryNavProps {
  user: any;
  className?: string;
}

type AdminNavItem = {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
  display_order: number;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ user, className }) => {
  const location = useLocation();
  const { toast } = useToast();
  const [adminNavItems, setAdminNavItems] = useState<AdminNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Only show the secondary nav to approved users
  if (!user?.user_metadata?.approved) {
    return null;
  }

  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  useEffect(() => {
    const fetchAdminNavItems = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_navigation')
          .select('*')
          .order('display_order', { ascending: true });
          
        if (error) {
          console.error('Error fetching admin navigation:', error);
          toast({
            title: "Error loading navigation",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setAdminNavItems(data || []);
        }
      } catch (err) {
        console.error('Exception fetching admin navigation:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchAdminNavItems();
    } else {
      setLoading(false);
    }
  }, [toast, isAdmin]);
  
  // Define regular links for approved users
  const regularLinks = [
    { name: "Licensing", href: "/licensing", icon: FileText },
    { name: "Support", href: "/support", icon: BadgeHelp },
    { name: "Downloads", href: "/downloads", icon: Download },
  ];
  
  // Define all admin pages
  const allAdminLinks = [
    { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Actions", href: "/admin/actions", icon: ActivitySquare },
    { name: "Permissions", href: "/admin/permissions", icon: Shield },
    { name: "Downloads", href: "/admin/downloads", icon: Download },
    { name: "Licensing", href: "/admin/licensing", icon: FileText },
  ];
  
  // Convert admin nav items to links format
  const dynamicAdminLinks = adminNavItems.map(item => ({
    name: item.title,
    href: item.route,
    icon: getIconComponent(item.icon)
  }));

  // Create final links array
  let links = regularLinks;
  
  // Add admin links if user is admin
  let adminLinks: Array<{ name: string; href: string; icon: LucideIcon }> = [];
  
  if (isAdmin) {
    // Start with all predefined admin links
    adminLinks = [...allAdminLinks];
    
    // Add dynamic links that don't already exist in predefined links
    dynamicAdminLinks.forEach(dynamicLink => {
      const exists = adminLinks.some(link => link.href === dynamicLink.href);
      if (!exists) {
        adminLinks.push(dynamicLink);
      }
    });
  }
  
  return (
    <div className={cn(
      "w-full backdrop-blur-md border-b transition-all duration-300",
      "bg-white/70 dark:bg-gray-900/70",
      className
    )}>
      <div className="flex items-center justify-between py-2 px-6 md:px-12 lg:px-24 overflow-x-auto">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {/* Resource links */}
          {regularLinks.map((link) => (
            <SecondaryNavLink 
              key={link.name} 
              name={link.name} 
              href={link.href} 
              icon={link.icon}
              active={location.pathname === link.href || 
                    (link.href !== "/" && location.pathname.startsWith(link.href))}
            />
          ))}
        </div>
        
        {/* Admin links section */}
        {isAdmin && (
          <div className="flex items-center space-x-4 overflow-x-auto">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading admin...</div>
            ) : (
              adminLinks.map((link) => (
                <SecondaryNavLink 
                  key={link.name} 
                  name={link.name} 
                  href={link.href} 
                  icon={link.icon}
                  active={location.pathname === link.href || 
                        (link.href !== "/" && location.pathname.startsWith(link.href))}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondaryNav;
