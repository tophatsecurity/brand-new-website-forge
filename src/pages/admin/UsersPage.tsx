import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import UserManagement from "@/components/admin/UserManagement";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";

const UsersPage = () => {
  const { user } = useAuth();
  
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout title="User Management">
      <UserManagement />
    </AdminLayout>
  );
};

export default UsersPage;
