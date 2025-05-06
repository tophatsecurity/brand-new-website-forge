
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type PermissionType = "downloads" | "support" | "admin";

const permissionTypes = [
  { key: "downloads" as PermissionType, label: "Downloads" },
  { key: "support" as PermissionType, label: "Support" },
  { key: "admin" as PermissionType, label: "Admin" }
];

interface UserPermissionsProps {
  user: any;
  onGrantPermission: (userId: string, permission: PermissionType) => Promise<void>;
  onRevokePermission: (permissionId: string) => Promise<void>;
}

const UserPermissions = ({ user, onGrantPermission, onRevokePermission }: UserPermissionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {user.permissions.map((p: any) => (
        <Badge key={p.id} className="bg-blue-50 text-blue-800 border-blue-200">
          {permissionTypes.find(pt => pt.key === p.permission)?.label || p.permission}
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1 ml-1"
            onClick={() => onRevokePermission(p.id)}
          >
            ✕
          </Button>
        </Badge>
      ))}
      {permissionTypes
        .filter(pt =>
          !user.permissions.some((p: any) => p.permission === pt.key)
        )
        .map(pt => (
          <Button
            key={pt.key}
            size="sm"
            variant="secondary"
            className="ml-1"
            onClick={() => onGrantPermission(user.id, pt.key)}
          >
            Grant {pt.label}
          </Button>
        ))}
    </div>
  );
};

export default UserPermissions;
