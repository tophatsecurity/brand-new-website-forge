import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  Key,
  Download,
  HelpCircle,
  CreditCard,
  Building2,
  Users,
  ClipboardList,
  LayoutDashboard,
  FileText,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserNavMenuProps {
  user: any;
  signOut: () => Promise<void>;
  isAdmin?: boolean;
}

const UserNavMenu: React.FC<UserNavMenuProps> = ({ user, signOut, isAdmin = false }) => {
  const navigate = useNavigate();
  const { activeRole } = useAuth();

  if (!user) {
    return null;
  }

  // Extract first letter of email for avatar
  const emailFirstLetter = user.email?.[0]?.toUpperCase() || 'U';
  const displayName = user.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Role-based menu items
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'var': return 'secondary';
      case 'customer_rep': return 'outline';
      default: return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'var': return 'VAR';
      case 'customer_rep': return 'Rep';
      case 'customer': return 'Customer';
      default: return 'User';
    }
  };

  // Common items for all users
  const commonItems = (
    <>
      <DropdownMenuItem onClick={() => navigate('/profile')}>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/settings')}>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
    </>
  );

  // Customer items
  const customerItems = (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-xs text-muted-foreground">Customer</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => navigate('/licensing')}>
        <Key className="mr-2 h-4 w-4" />
        <span>My Licenses</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/downloads')}>
        <Download className="mr-2 h-4 w-4" />
        <span>Downloads</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/credits')}>
        <CreditCard className="mr-2 h-4 w-4" />
        <span>Credits</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/support')}>
        <HelpCircle className="mr-2 h-4 w-4" />
        <span>Support</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/onboarding')}>
        <ClipboardList className="mr-2 h-4 w-4" />
        <span>Onboarding</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );

  // VAR / Customer Rep items
  const repItems = (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-xs text-muted-foreground">Sales & Support</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => navigate('/admin/crm')}>
        <Building2 className="mr-2 h-4 w-4" />
        <span>CRM</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/admin/onboarding')}>
        <ClipboardList className="mr-2 h-4 w-4" />
        <span>Customer Onboarding</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/admin/licensing')}>
        <Key className="mr-2 h-4 w-4" />
        <span>License Management</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );

  // Admin items
  const adminItems = (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-xs text-muted-foreground">Administration</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => navigate('/admin')}>
        <LayoutDashboard className="mr-2 h-4 w-4" />
        <span>Admin Dashboard</span>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Shield className="mr-2 h-4 w-4" />
          <span>Admin Tools</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="bg-popover">
          <DropdownMenuItem onClick={() => navigate('/admin/users')}>
            <Users className="mr-2 h-4 w-4" />
            <span>User Management</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/permissions')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Permissions</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/crm')}>
            <Building2 className="mr-2 h-4 w-4" />
            <span>CRM</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/licensing')}>
            <Key className="mr-2 h-4 w-4" />
            <span>Licensing</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/catalog')}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Catalog</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/credits')}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Credits</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/downloads')}>
            <Download className="mr-2 h-4 w-4" />
            <span>Downloads</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/onboarding')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>Onboarding</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {emailFirstLetter}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <Badge variant={getRoleBadgeVariant(activeRole)} className="text-xs h-5">
                {getRoleLabel(activeRole)}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Common items for all users */}
        <DropdownMenuGroup>
          {commonItems}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Role-based items */}
        {(activeRole === 'customer' || activeRole === 'user') && (
          <>
            {customerItems}
            <DropdownMenuSeparator />
          </>
        )}

        {(activeRole === 'var' || activeRole === 'customer_rep') && (
          <>
            {customerItems}
            <DropdownMenuSeparator />
            {repItems}
            <DropdownMenuSeparator />
          </>
        )}

        {activeRole === 'admin' && (
          <>
            {customerItems}
            <DropdownMenuSeparator />
            {repItems}
            <DropdownMenuSeparator />
            {adminItems}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNavMenu;
