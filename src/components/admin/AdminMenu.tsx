
import React from 'react';
import { Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Users, FileText, Shield, Download, Settings } from 'lucide-react';

interface AdminMenuProps {
  isAdmin: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ isAdmin }) => {
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
              <Link to="/admin/users" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                <Users className="h-5 w-5" />
                <div className="col-span-3">
                  <div className="font-medium mb-1">Users</div>
                  <p className="text-sm text-muted-foreground">Manage user accounts</p>
                </div>
              </Link>
              <Link to="/admin/actions" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                <Settings className="h-5 w-5" />
                <div className="col-span-3">
                  <div className="font-medium mb-1">Actions</div>
                  <p className="text-sm text-muted-foreground">View and manage system actions</p>
                </div>
              </Link>
              <Link to="/admin/permissions" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                <Shield className="h-5 w-5" />
                <div className="col-span-3">
                  <div className="font-medium mb-1">Permissions</div>
                  <p className="text-sm text-muted-foreground">Configure user permissions</p>
                </div>
              </Link>
              <Link to="/admin/downloads" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                <Download className="h-5 w-5" />
                <div className="col-span-3">
                  <div className="font-medium mb-1">Downloads</div>
                  <p className="text-sm text-muted-foreground">Manage product downloads</p>
                </div>
              </Link>
              <Link to="/admin/licensing" className="group grid grid-cols-4 items-center justify-start gap-1 rounded-md p-3 hover:bg-accent">
                <FileText className="h-5 w-5" />
                <div className="col-span-3">
                  <div className="font-medium mb-1">Licensing</div>
                  <p className="text-sm text-muted-foreground">Manage product licenses</p>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default AdminMenu;
