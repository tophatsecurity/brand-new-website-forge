
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

type Role = {
  id: string;
  name: string;
  description: string;
};

type Permission = {
  id: string;
  name: string;
  category: string;
  defaultRoles: string[];
};

interface PermissionMatrixProps {
  roles: Role[];
  permissions: Permission[];
  rolePermissions: Record<string, string[]>;
  onPermissionToggle: (roleId: string, permissionId: string) => void;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ 
  roles, 
  permissions, 
  rolePermissions,
  onPermissionToggle
}) => {
  return (
    <div className="bg-card rounded-lg shadow-md p-6 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Permission</TableHead>
            {roles.map(role => (
              <TableHead key={role.id} className="text-center">{role.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map(permission => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{permission.name}</span>
                  <span className="text-xs text-muted-foreground">{permission.category}</span>
                </div>
              </TableCell>
              {roles.map(role => (
                <TableCell key={role.id} className="text-center">
                  <Switch
                    checked={rolePermissions[role.id]?.includes(permission.id)}
                    onCheckedChange={() => onPermissionToggle(role.id, permission.id)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PermissionMatrix;
