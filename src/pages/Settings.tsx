
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import UserSettings from '@/components/UserSettings';
import AccountSettings from '@/components/AccountSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-12">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <p>Please log in to access your settings.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <h2 className="text-xl font-semibold">Account Settings</h2>
            <p className="text-muted-foreground mb-6">
              Manage your account details and preferences
            </p>
            
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <h2 className="text-xl font-semibold">Appearance Settings</h2>
            <p className="text-muted-foreground mb-6">
              Customize how the application looks and feels
            </p>
            
            <UserSettings userId={user.id} />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            <p className="text-muted-foreground mb-6">
              Control your notification preferences
            </p>
            
            <UserSettings userId={user.id} />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <h2 className="text-xl font-semibold">Security Settings</h2>
            <p className="text-muted-foreground mb-6">
              Manage your security and account access
            </p>
            
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
