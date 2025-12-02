import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-20">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {title && (
              <h1 className="text-2xl font-bold mb-6 text-foreground">{title}</h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
