
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { BadgeHelp, LucideIcon, FileText, Download } from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SecondaryNavLinkProps = {
  name: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

// Helper to convert icon string to Lucide icon component
const getIconComponent = (iconName: string): LucideIcon => {
  // Import icons dynamically - add more as needed
  const icons: Record<string, LucideIcon> = {
    'Users': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    'Settings': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
    'Shield': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>,
    'Download': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>,
    'FileText': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>,
    'BadgeHelp': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>,
    'Wrench': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
    'Database': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    'Key': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
  };
  
  return icons[iconName] || FileText;  // Default to FileText if icon not found
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
