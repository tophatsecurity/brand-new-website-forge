
import React from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const UserNavMenu = () => {
  const { user } = useAuth();

  if (!user?.user_metadata?.approved) {
    return null;
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <Link to="/downloads" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                <Download className="h-5 w-5" />
                <div className="col-span-3">
                  <div className="font-medium mb-1">Downloads</div>
                  <p className="text-sm text-muted-foreground">Access product downloads and updates</p>
                </div>
              </Link>
              <Link to="/support" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                <LifeBuoy className="h-5 w-5" />
                <div className="col-span-3">
                  <div className="font-medium mb-1">Support</div>
                  <p className="text-sm text-muted-foreground">Get help with our products</p>
                </div>
              </Link>
              <Link to="/licensing" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                <FileText className="h-5 w-5" />
                <div className="col-span-3">
                  <div className="font-medium mb-1">Licensing</div>
                  <p className="text-sm text-muted-foreground">View and manage your licenses</p>
                </div>
              </Link>
              {user?.user_metadata?.role === 'admin' && (
                <Link to="/admin" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                  <FileText className="h-5 w-5" />
                  <div className="col-span-3">
                    <div className="font-medium mb-1">User Management</div>
                    <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
                  </div>
                </Link>
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default UserNavMenu;
