
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getIconComponent } from '@/components/navbar/IconRegistry';

type AdminNavItem = {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
  display_order: number;
}

export type AdminNavLink = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export const useAdminNavigation = (isAdmin: boolean) => {
  const { toast } = useToast();
  const [adminNavItems, setAdminNavItems] = useState<AdminNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  // Define all admin pages
  const predefinedAdminLinks: AdminNavLink[] = [
    { name: "Admin Dashboard", href: "/admin", icon: getIconComponent("LayoutDashboard") },
    { name: "Users", href: "/admin/users", icon: getIconComponent("Users") },
    { name: "Actions", href: "/admin/actions", icon: getIconComponent("ActivitySquare") },
    { name: "Permissions", href: "/admin/permissions", icon: getIconComponent("Shield") },
    { name: "Downloads", href: "/admin/downloads", icon: getIconComponent("Download") },
    { name: "Licensing", href: "/admin/licensing", icon: getIconComponent("Key") },
    { name: "Credits", href: "/admin/credits", icon: getIconComponent("Coins") },
  ];
  
  // Convert admin nav items to links format
  const dynamicAdminLinks: AdminNavLink[] = adminNavItems.map(item => ({
    name: item.title,
    href: item.route,
    icon: getIconComponent(item.icon)
  }));

  // Combine all admin links, avoiding duplicates
  const getAllAdminLinks = (): AdminNavLink[] => {
    const adminLinks = [...predefinedAdminLinks];
    
    // Add dynamic links that don't already exist in predefined links
    dynamicAdminLinks.forEach(dynamicLink => {
      const exists = adminLinks.some(link => link.href === dynamicLink.href);
      if (!exists) {
        adminLinks.push(dynamicLink);
      }
    });
    
    return adminLinks;
  };

  return {
    adminLinks: getAllAdminLinks(),
    loading
  };
};
