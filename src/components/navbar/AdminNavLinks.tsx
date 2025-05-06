
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import SecondaryNavLink from './SecondaryNavLink';
import { useAdminNavigation, AdminNavLink } from '@/hooks/useAdminNavigation';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminNavLinksProps {
  isAdmin: boolean;
  className?: string;
}

const AdminNavLinks: React.FC<AdminNavLinksProps> = ({ isAdmin, className }) => {
  const location = useLocation();
  const { toast } = useToast();
  const [navVisible, setNavVisible] = useState<boolean>(false);
  
  // Get admin links from the hook
  const { adminLinks, loading } = useAdminNavigation(isAdmin);

  // Check if the user has permission to access admin pages
  useEffect(() => {
    const checkAdminPermissions = async () => {
      if (!isAdmin) return;
      
      try {
        const { data: user } = await supabase.auth.getUser();
        
        if (user?.user?.id) {
          // If the user is authenticated and has admin role, show the admin nav
          setNavVisible(true);
        } else {
          setNavVisible(false);
        }
      } catch (error) {
        console.error('Error checking admin permissions:', error);
        toast({
          title: "Error",
          description: "Could not verify admin permissions",
          variant: "destructive"
        });
        setNavVisible(false);
      }
    };
    
    checkAdminPermissions();
  }, [isAdmin, toast]);

  if (!isAdmin || !navVisible) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-4 overflow-x-auto ${className}`}>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading admin...</div>
      ) : (
        adminLinks.map((link: AdminNavLink) => (
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
  );
};

export default AdminNavLinks;
