import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import UserManagement from "@/components/admin/UserManagement";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Briefcase, HeadphonesIcon, Store, Gift } from "lucide-react";

const ROLE_TABS = [
  { value: 'all', label: 'All Users', icon: Users },
  { value: 'var', label: 'VARs', icon: Store },
  { value: 'account_rep', label: 'Account Reps', icon: Briefcase },
  { value: 'customer_rep', label: 'Customer Service', icon: HeadphonesIcon },
  { value: 'customer', label: 'Customers', icon: UserCheck },
  { value: 'free', label: 'Free', icon: Gift },
];

const UsersPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout title="User Management">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          {ROLE_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab}>
          <UserManagement roleFilter={activeTab === 'all' ? undefined : activeTab} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default UsersPage;
