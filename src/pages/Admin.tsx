
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserManagement from '@/components/admin/UserManagement';

const Admin = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <UserManagement />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;

