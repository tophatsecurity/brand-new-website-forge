
import React from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { type UserSettings as UserSettingsType } from '@/hooks/useUserSettings'; // Use type-only import with alias
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface UserSettingsProps {
  userId: string;
}

const UserSettings: React.FC<UserSettingsProps> = ({ userId }) => {
  const { settings, loading, updateUserSettings } = useUserSettings(userId);

  const form = useForm<UserSettingsType>({
    defaultValues: settings,
    values: settings,
  });

  const onSubmit = async (data: UserSettingsType) => {
    await updateUserSettings(data);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Loading your preferences...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Theme Setting */}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how the application looks
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Display Density */}
            <FormField
              control={form.control}
              name="display_density"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Density</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select display density" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Adjust the spacing between elements
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Notifications Setting */}
            <FormField
              control={form.control}
              name="notifications_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Notifications</FormLabel>
                    <FormDescription>
                      Enable in-app notifications
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Email Notifications */}
            <FormField
              control={form.control}
              name="email_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Email Notifications</FormLabel>
                    <FormDescription>
                      Receive email notifications about important updates
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">Save Settings</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default UserSettings;
