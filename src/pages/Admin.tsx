
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Admin = () => {
  const { user } = useAuth();
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-40 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Welcome to the admin dashboard. Use the navigation bar above to access different admin sections.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
