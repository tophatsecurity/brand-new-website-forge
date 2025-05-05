
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";

const ActionsPage = () => {
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
          <h1 className="text-3xl font-bold mb-8">System Actions</h1>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Available Actions</h2>
            <p className="text-muted-foreground mb-6">
              This page allows administrators to perform system-wide actions. 
              Coming soon: audit logs, system maintenance, and more.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Database Maintenance</h3>
                <p className="text-sm text-muted-foreground mb-4">Schedule and manage database maintenance tasks.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Coming Soon
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">System Backup</h3>
                <p className="text-sm text-muted-foreground mb-4">Manage system backups and restoration points.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActionsPage;
