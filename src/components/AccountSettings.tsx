import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw } from 'lucide-react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { generateSluggedUsername } from '@/utils/usernameGenerator';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const { settings, loading: settingsLoading, updateUserSettings, refetch } = useUserSettings(user?.id);
  const [anonymousHandle, setAnonymousHandle] = useState('');
  const [isSavingHandle, setIsSavingHandle] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { toast } = useToast();
  
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Sync anonymous handle with settings
  useEffect(() => {
    if (settings.anonymous_handle) {
      setAnonymousHandle(settings.anonymous_handle);
    }
  }, [settings.anonymous_handle]);

  const handleGenerateHandle = () => {
    setAnonymousHandle(generateSluggedUsername());
  };

  const handleSaveHandle = async () => {
    setIsSavingHandle(true);
    try {
      const success = await updateUserSettings({ anonymous_handle: anonymousHandle || null });
      if (success) {
        toast({
          title: 'Anonymous handle saved',
          description: anonymousHandle 
            ? 'Your persistent anonymous handle has been saved' 
            : 'Your anonymous handle has been cleared',
        });
      }
    } finally {
      setIsSavingHandle(false);
    }
  };

  const handleClearHandle = async () => {
    setAnonymousHandle('');
    setIsSavingHandle(true);
    try {
      await updateUserSettings({ anonymous_handle: null });
      toast({
        title: 'Anonymous handle cleared',
        description: 'A new random handle will be generated for each submission',
      });
    } finally {
      setIsSavingHandle(false);
    }
  };

  const handleUpdateEmail = async (data: z.infer<typeof emailSchema>) => {
    try {
      setIsUpdatingEmail(true);
      const { error } = await supabase.auth.updateUser({ email: data.email });
      
      if (error) throw error;
      
      toast({
        title: 'Email update initiated',
        description: 'Please check your new email to confirm the change',
      });
      
      emailForm.reset();
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: 'Error updating email',
        description: error.message || 'An error occurred while updating your email',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (data: z.infer<typeof passwordSchema>) => {
    try {
      setIsUpdatingPassword(true);
      
      // Get current user email - fix the Promise<string> error by using async/await properly
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email || '';
      
      if (!userEmail) {
        throw new Error('Unable to retrieve user email');
      }
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: data.currentPassword,
      });
      
      if (signInError) throw new Error('Current password is incorrect');
      
      // Then update to the new password
      const { error } = await supabase.auth.updateUser({ 
        password: data.newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully',
      });
      
      passwordForm.reset();
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error updating password',
        description: error.message || 'An error occurred while updating your password',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>Update your email address</CardDescription>
        </CardHeader>
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleUpdateEmail)}>
            <CardContent className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Enter your new email" />
                    </FormControl>
                    <FormDescription>
                      We'll send a confirmation to this email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdatingEmail}>
                {isUpdatingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Email'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anonymous Handle</CardTitle>
          <CardDescription>Set a persistent anonymous username for feature requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Anonymous Handle</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input 
                  value={anonymousHandle}
                  onChange={(e) => setAnonymousHandle(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  placeholder="cyborg-ninja-42"
                  className="pl-7 font-mono"
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleGenerateHandle}
                title="Generate random handle"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This handle will be used for all your feature request submissions instead of generating a new one each time.
              Leave empty to generate a unique handle for each submission.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleSaveHandle} disabled={isSavingHandle || settingsLoading}>
            {isSavingHandle ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Handle'
            )}
          </Button>
          {settings.anonymous_handle && (
            <Button variant="outline" onClick={handleClearHandle} disabled={isSavingHandle}>
              Clear Handle
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)}>
            <CardContent className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Enter your current password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Enter your new password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Confirm your new password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AccountSettings;
