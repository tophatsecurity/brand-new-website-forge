
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LucideIcon } from 'lucide-react';
import { Users, FileText, Shield, Download, Settings, BadgeHelp, Wrench, Database, Key } from 'lucide-react';

interface AdminMenuProps {
  isAdmin: boolean;
}

type AdminNavItem = {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
  display_order: number;
}

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

const AdminMenu: React.FC<AdminMenuProps> = ({ isAdmin }) => {
  const { toast } = useToast();
  const [adminNavItems, setAdminNavItems] = useState<AdminNavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      const fetchAdminNavItems = async () => {
        try {
          const { data, error } = await supabase
            .from('admin_navigation')
            .select('*')
            .order('display_order', { ascending: true });
            
          if (error) {
            console.error('Error fetching admin navigation:', error);
            toast({
              title: "Error loading admin menu",
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
    }
  }, [isAdmin, toast]);

  if (!isAdmin) {
    return null;
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              {loading ? (
                <div className="p-2">Loading admin menu...</div>
              ) : (
                adminNavItems.map((item) => {
                  const Icon = getIconComponent(item.icon);
                  return (
                    <Link 
                      key={item.id}
                      to={item.route} 
                      className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent"
                    >
                      <Icon className="h-5 w-5" />
                      <div className="col-span-3">
                        <div className="font-medium mb-1">{item.title}</div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default AdminMenu;
