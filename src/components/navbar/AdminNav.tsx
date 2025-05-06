
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import AdminNavLinks from './AdminNavLinks';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import { Button } from '@/components/ui/button';
import { Plus, Download, Key } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface AdminNavProps {
  user: any;
  className?: string;
}

const AdminNav: React.FC<AdminNavProps> = ({ user, className }) => {
  const { isAdmin } = useAuth();
  const { adminLinks } = useAdminNavigation(isAdmin);
  const location = useLocation();
  
  // Create action buttons based on the current route
  const renderActionButton = () => {
    // Admin Downloads page
    if (location.pathname === '/admin/downloads') {
      return (
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Download
        </Button>
      );
    }
    
    // Admin Licensing page
    if (location.pathname === '/admin/licensing') {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Key className="h-4 w-4 mr-2" />
              Create License
            </Button>
          </DialogTrigger>
        </Dialog>
      );
    }
    
    return null;
  };
  
  return (
    <div className={cn(
      "w-full border-b transition-all duration-300",
      "bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center py-2 px-6 md:px-12 lg:px-24 overflow-x-auto">
        <div className="text-sm font-semibold text-foreground/70 dark:text-foreground/70 mr-4">
          Admin:
        </div>
        <AdminNavLinks 
          className="flex-1" 
          links={adminLinks} 
          actionButton={renderActionButton()}
        />
      </div>
    </div>
  );
};

export default AdminNav;
