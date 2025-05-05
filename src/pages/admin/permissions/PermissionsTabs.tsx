
import React from 'react';
import { Button } from "@/components/ui/button";

interface PermissionsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PermissionsTabs: React.FC<PermissionsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex mb-6 space-x-4">
      <Button 
        variant={activeTab === "roles" ? "default" : "outline"}
        onClick={() => onTabChange("roles")}
      >
        Roles
      </Button>
      <Button 
        variant={activeTab === "matrix" ? "default" : "outline"}
        onClick={() => onTabChange("matrix")}
      >
        Permission Matrix
      </Button>
      <Button 
        variant={activeTab === "create" ? "default" : "outline"}
        onClick={() => onTabChange("create")}
      >
        Create New Role
      </Button>
    </div>
  );
};

export default PermissionsTabs;
