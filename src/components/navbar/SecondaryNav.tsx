
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

// Import our icons directly from lucide-react
import { 
  Users, 
  Settings, 
  Shield, 
  Download, 
  FileText, 
  BadgeHelp, 
  Wrench, 
  Database, 
  Key 
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
    'Key': Key
  };
  
  return iconMap[iconName] || FileText;  // Default to FileText if icon not found
};

const SecondaryNavLink: React.FC<SecondaryNavLinkProps> = ({ name, href, icon: Icon, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center text-sm font-medium transition-colors px-2 py-1 rounded-md",
        active 
          ? "text-foreground bg-muted/80" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
    
    fetchAdminNavItems();
  }, [toast]);
  
  // Define regular links
  const regularLinks = [
    { name: "Licensing", href: "/licensing", icon: FileText },
    { name: "Support", href: "/support", icon: BadgeHelp },
    { name: "Downloads", href: "/downloads", icon: Download },
  ];
  
  // Convert admin nav items to links format
  const adminLinks = adminNavItems.map(item => ({
    name: item.title,
    href: item.route,
    icon: getIconComponent(item.icon)
  }));

  // Include admin links only if user is admin
  const links = isAdmin ? [...regularLinks, ...adminLinks] : regularLinks;

  return (
    <div className={cn(
      "w-full bg-muted/50 border-b py-2 px-6 md:px-12 lg:px-24",
      className
    )}>
      <div className="flex items-center justify-start space-x-2 overflow-x-auto">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading navigation...</div>
        ) : (
          links.map((link) => (
            <SecondaryNavLink 
              key={link.name} 
              name={link.name} 
              href={link.href} 
              icon={link.icon}
              active={location.pathname === link.href}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SecondaryNav;
