
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, User } from 'lucide-react';

interface RoleSwitcherProps {
  selectedRole: string | null;
  onRoleChange: (role: string) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="flex items-center">
      <span className="text-sm font-medium mr-2 text-muted-foreground">View as:</span>
      <Select value={selectedRole || undefined} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin" className="flex items-center">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </div>
          </SelectItem>
          <SelectItem value="user" className="flex items-center">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>User</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSwitcher;
