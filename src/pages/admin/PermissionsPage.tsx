
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";

// Import our components
import PermissionsTabs from './permissions/PermissionsTabs';
import RolesList from './permissions/RolesList';
import PermissionMatrix from './permissions/PermissionMatrix';
import CreateRoleForm from './permissions/CreateRoleForm';
import PermissionsHeader from './permissions/PermissionsHeader';
import PermissionsLoading from './permissions/PermissionsLoading';

// Import our custom hook
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
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <PermissionsHeader />
          
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PermissionsPage;
