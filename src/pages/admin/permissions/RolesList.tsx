
import React from 'react';
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface RolesListProps {
  roles: Role[];
  permissions: Permission[];
  rolePermissions: Record<string, string[]>;
}

const RolesList: React.FC<RolesListProps> = ({ roles, permissions, rolePermissions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map(role => (
        <Card key={role.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-4 w-4 mr-2" />
              {role.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Permissions:</p>
              <ul className="text-sm pl-5 list-disc space-y-1">
                {permissions
                  .filter(p => rolePermissions[role.id]?.includes(p.id))
                  .map(p => (
                    <li key={p.id}>{p.name}</li>
                  ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RolesList;
