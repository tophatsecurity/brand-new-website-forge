
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, User, Users, Briefcase, UserCheck } from 'lucide-react';

interface RoleSwitcherProps {
  selectedRole: string | null;
  onRoleChange: (role: string) => void;
  availableRoles?: string[];
}

const roleConfig = {
  admin: { label: 'Admin', icon: Shield, description: 'Full access to all features' },
  var: { label: 'VAR', icon: Briefcase, description: 'Value Added Reseller access' },
  customer_rep: { label: 'Customer Rep', icon: UserCheck, description: 'Customer support access' },
  customer: { label: 'Customer', icon: Users, description: 'Customer portal access' },
  user: { label: 'User', icon: User, description: 'Standard user access' },
  moderator: { label: 'Moderator', icon: Shield, description: 'Moderation access' },
};

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ 
  selectedRole, 
  onRoleChange,
  availableRoles = ['admin', 'var', 'customer_rep', 'customer']
}) => {
  return (
    <div className="flex items-center">
      <span className="text-sm font-medium mr-2 text-muted-foreground">View as:</span>
      <Select value={selectedRole || undefined} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => {
            const config = roleConfig[role as keyof typeof roleConfig];
            if (!config) return null;
            const IconComponent = config.icon;
            return (
              <SelectItem key={role} value={role} className="flex items-center">
                <div className="flex items-center">
                  <IconComponent className="mr-2 h-4 w-4" />
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSwitcher;
