
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

// Import our new components
import PermissionsTabs from './permissions/PermissionsTabs';
import RolesList from './permissions/RolesList';
import PermissionMatrix from './permissions/PermissionMatrix';
import CreateRoleForm from './permissions/CreateRoleForm';

const roles = [
  { id: "admin", name: "Administrator", description: "Full system access" },
  { id: "manager", name: "Manager", description: "Can manage most system features" },
  { id: "user", name: "Standard User", description: "Basic system access" },
  { id: "support", name: "Support Agent", description: "Can access support features" },
]

const permissions = [
  { id: "users_view", name: "View Users", category: "Users", defaultRoles: ["admin", "manager"] },
  { id: "users_edit", name: "Edit Users", category: "Users", defaultRoles: ["admin"] },
  { id: "downloads_access", name: "Access Downloads", category: "Downloads", defaultRoles: ["admin", "manager", "user"] },
  { id: "downloads_manage", name: "Manage Downloads", category: "Downloads", defaultRoles: ["admin", "manager"] },
  { id: "licensing_view", name: "View Licenses", category: "Licensing", defaultRoles: ["admin", "manager", "user"] },
  { id: "licensing_manage", name: "Manage Licenses", category: "Licensing", defaultRoles: ["admin"] },
  { id: "support_view", name: "View Support Tickets", category: "Support", defaultRoles: ["admin", "manager", "support"] },
  { id: "support_resolve", name: "Resolve Support Tickets", category: "Support", defaultRoles: ["admin", "support"] },
]

type FormValues = {
  roleName: string;
  roleDescription: string;
};

const PermissionsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("roles");
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(
    roles.reduce((acc, role) => ({
      ...acc,
      [role.id]: permissions
        .filter(p => p.defaultRoles.includes(role.id))
        .map(p => p.id)
    }), {})
  );
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRolePermissions(prev => {
      const currentPermissions = prev[roleId] || [];
      if (currentPermissions.includes(permissionId)) {
        return {
          ...prev,
          [roleId]: currentPermissions.filter(id => id !== permissionId)
        };
      } else {
        return {
          ...prev,
          [roleId]: [...currentPermissions, permissionId]
        };
      }
    });
    
    toast({
      title: "Permission updated",
      description: `Updated permissions for role.`,
    });
  };

  const onSubmit = (data: FormValues) => {
    // Here you would typically save the new role to your backend
    toast({
      title: "Role created",
      description: `Created new role: ${data.roleName}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Shield className="mr-2 h-6 w-6" />
            <h1 className="text-3xl font-bold">Permission Management</h1>
          </div>
          
          <PermissionsTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === "roles" && (
            <RolesList 
              roles={roles} 
              permissions={permissions} 
              rolePermissions={rolePermissions} 
            />
          )}
          
          {activeTab === "matrix" && (
            <PermissionMatrix 
              roles={roles} 
              permissions={permissions} 
              rolePermissions={rolePermissions}
              onPermissionToggle={handlePermissionToggle}
            />
          )}
          
          {activeTab === "create" && (
            <CreateRoleForm 
              permissions={permissions}
              onSubmit={onSubmit}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PermissionsPage;
