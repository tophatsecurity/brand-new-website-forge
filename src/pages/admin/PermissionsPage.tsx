
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";

const PermissionsPage = () => {
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
          <h1 className="text-3xl font-bold mb-8">Permission Management</h1>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Role Configuration</h2>
            <p className="text-muted-foreground mb-6">
              This page allows administrators to manage user roles and permissions throughout the system.
              Configure granular permissions for different user roles.
            </p>
            
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-2">Role Assignments</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure which roles have access to specific features and functionality.
              </p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Coming Soon
              </button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Custom Permissions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage custom permission sets for specialized user groups.
              </p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PermissionsPage;
