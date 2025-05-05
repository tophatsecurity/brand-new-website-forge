
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
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
            <CardFooter className="flex justify-between">
              <Button variant="outline">Update Profile</Button>
              <Button onClick={handleSetAdmin}>Make Admin (Test Only)</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-muted-foreground">Last changed: Never</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Change Password</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
