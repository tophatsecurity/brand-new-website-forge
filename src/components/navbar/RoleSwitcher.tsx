import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Shield, User, Users, Briefcase, UserCheck, ChevronDown, Check, TrendingUp, Megaphone } from 'lucide-react';
import { AppRole } from '@/hooks/useRolePermissions';

interface RoleSwitcherProps {
  selectedRole: AppRole | null;
  onRoleChange: (role: AppRole) => void;
  availableRoles: AppRole[];
  isAdmin?: boolean;
}

const roleConfig: Record<AppRole, { label: string; icon: React.ElementType; description: string }> = {
  admin: { label: 'Admin', icon: Shield, description: 'Full access to all features' },
  account_rep: { label: 'Account Rep', icon: Briefcase, description: 'Account management access' },
  marketing: { label: 'Marketing', icon: Megaphone, description: 'Marketing and campaigns access' },
  var: { label: 'VAR', icon: TrendingUp, description: 'Value Added Reseller access' },
  customer_rep: { label: 'Customer Rep', icon: UserCheck, description: 'Customer support access' },
  customer: { label: 'Customer', icon: Users, description: 'Customer portal access' },
  user: { label: 'User', icon: User, description: 'Standard user access' },
  moderator: { label: 'Moderator', icon: Shield, description: 'Moderation access' },
};

// All roles an admin can switch to for testing
const allSwitchableRoles: AppRole[] = ['admin', 'account_rep', 'marketing', 'var', 'customer_rep', 'customer'];

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ 
  selectedRole, 
  onRoleChange,
  availableRoles,
  isAdmin = false,
}) => {
  // If admin, show all switchable roles; otherwise show user's assigned roles
  const displayRoles = isAdmin ? allSwitchableRoles : availableRoles;
  
  const currentConfig = selectedRole ? roleConfig[selectedRole] : null;
  const CurrentIcon = currentConfig?.icon || User;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentConfig?.label || 'Select Role'}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {isAdmin ? 'View as Role' : 'Switch Role'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {displayRoles.map((role) => {
          const config = roleConfig[role];
          if (!config) return null;
          const IconComponent = config.icon;
          const isSelected = selectedRole === role;
          
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => onRoleChange(role)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <IconComponent className="h-4 w-4" />
              <div className="flex flex-col flex-1">
                <span className="font-medium">{config.label}</span>
                <span className="text-xs text-muted-foreground">{config.description}</span>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;
