
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Role = {
  id: string;
  name: string;
  description: string;
};

export type Permission = {
  id: string;
  name: string;
  category: string;
  defaultRoles: string[];
};

export type FormValues = {
  roleName: string;
  roleDescription: string;
};

export const usePermissionsManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [toast]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch roles from the database
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Fetch permissions from the database
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permission_types')
        .select('*');
      
      if (permissionsError) throw permissionsError;
      
      // Fetch role-permission assignments
      const { data: rolePermData, error: rolePermError } = await supabase
        .from('role_permissions')
        .select('*');
      
      if (rolePermError) throw rolePermError;
      
      // Prepare data for components
      const formattedRoles = rolesData.map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      }));
      
      const formattedPermissions = permissionsData.map((perm: any) => ({
        id: perm.id,
        name: perm.name,
        category: perm.category,
        defaultRoles: [] // We'll populate this from role_permissions
      }));
      
      // Create rolePermissions map
      const permMap: Record<string, string[]> = {};
      rolesData.forEach((role: any) => {
        permMap[role.id] = rolePermData
          .filter((rp: any) => rp.role_id === role.id)
          .map((rp: any) => rp.permission_id);
      });
      
      setRoles(formattedRoles);
      setPermissions(formattedPermissions);
      setRolePermissions(permMap);
      
    } catch (error: any) {
      console.error('Error fetching permission data:', error);
      toast({
        title: "Failed to load permissions data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = async (roleId: string, permissionId: string) => {
    try {
      const currentPermissions = rolePermissions[roleId] || [];
      const hasPermission = currentPermissions.includes(permissionId);
      
      if (hasPermission) {
        // Remove the permission
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .match({ role_id: roleId, permission_id: permissionId });
          
        if (error) throw error;
        
        // Update the state
        setRolePermissions(prev => ({
          ...prev,
          [roleId]: prev[roleId].filter(id => id !== permissionId)
        }));
      } else {
        // Add the permission
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role_id: roleId, permission_id: permissionId });
          
        if (error) throw error;
        
        // Update the state
        setRolePermissions(prev => ({
          ...prev,
          [roleId]: [...(prev[roleId] || []), permissionId]
        }));
      }
      
      toast({
        title: "Permission updated",
        description: `Updated permissions for role.`,
      });
    } catch (error: any) {
      console.error('Error updating permission:', error);
      toast({
        title: "Failed to update permission",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const onSubmitNewRole = async (data: FormValues) => {
    try {
      // Create the new role
      const { data: newRole, error } = await supabase
        .from('roles')
        .insert({
          name: data.roleName,
          description: data.roleDescription,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add the new role to the state
      setRoles(prev => [...prev, {
        id: newRole.id,
        name: newRole.name,
        description: newRole.description,
      }]);
      
      // Initialize empty permissions for the new role
      setRolePermissions(prev => ({
        ...prev,
        [newRole.id]: []
      }));
      
      toast({
        title: "Role created",
        description: `Created new role: ${data.roleName}`,
      });
      
      // Switch to the roles tab to see the new role
      setActiveTab("roles");
    } catch (error: any) {
      console.error('Error creating role:', error);
      toast({
        title: "Failed to create role",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    roles,
    permissions,
    rolePermissions,
    loading,
    handlePermissionToggle,
    onSubmitNewRole
  };
};
