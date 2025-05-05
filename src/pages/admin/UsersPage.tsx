
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserManagement from "@/components/admin/UserManagement";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";

const UsersPage = () => {
  const { user } = useAuth();
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">User Management</h1>
          <UserManagement />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UsersPage;
