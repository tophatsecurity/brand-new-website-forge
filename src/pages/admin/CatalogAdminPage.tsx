import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import CatalogManagement from "@/components/admin/licensing/CatalogManagement";

const CatalogAdminPage = () => {
  const { user } = useAuth();
  
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout title="Product Catalog">
      <div className="bg-card rounded-lg shadow-md p-6">
        <CatalogManagement />
      </div>
    </AdminLayout>
  );
};

export default CatalogAdminPage;
