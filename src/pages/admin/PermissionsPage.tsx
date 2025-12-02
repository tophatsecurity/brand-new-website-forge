import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";

import PermissionsTabs from './permissions/PermissionsTabs';
import RolesList from './permissions/RolesList';
import PermissionMatrix from './permissions/PermissionMatrix';
import CreateRoleForm from './permissions/CreateRoleForm';
import PermissionsLoading from './permissions/PermissionsLoading';

import { usePermissionsManagement } from '@/hooks/usePermissionsManagement';

const PermissionsPage = () => {
  const { user } = useAuth();
  const {
    activeTab,
    setActiveTab,
    roles,
    permissions,
    rolePermissions,
    loading,
    handlePermissionToggle,
    onSubmitNewRole
  } = usePermissionsManagement();
  
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout title="Permissions Management">
      <PermissionsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {loading ? (
        <PermissionsLoading />
      ) : (
        <>
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
              onSubmit={onSubmitNewRole}
            />
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default PermissionsPage;
