
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import UserSettings from '@/components/UserSettings';
import AccountSettings from '@/components/AccountSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user, setUserAsAdmin } = useAuth();

  const handleSetAdmin = async () => {
    if (!user) return;
    
    try {
      const { error } = await setUserAsAdmin(user.id);
      if (error) {
        toast({
          title: 'Error',
          description: `Failed to set admin role: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Admin role set successfully. You may need to log out and back in to see the changes.',
        });
      }
    } catch (err) {
      console.error('Error setting admin role:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs defaultValue="account" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Account Info</TabsTrigger>
            <TabsTrigger value="settings">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-muted-foreground">
                      {user?.user_metadata?.approved ? 'Approved' : 'Pending Approval'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Role</p>
                    <p className="text-muted-foreground">
                      {user?.user_metadata?.role || 'User'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSetAdmin} variant="outline">Make Admin (Test Only)</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            {user && <UserSettings userId={user.id} />}
          </TabsContent>
          
          <TabsContent value="security">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
