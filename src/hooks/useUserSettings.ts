import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserSettings = {
  id?: string;
  user_id: string;
  theme: string;
  display_density: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  anonymous_handle: string | null;
};

export const useUserSettings = (userId?: string) => {
  const [settings, setSettings] = useState<UserSettings>({
    user_id: userId || '',
    theme: 'system',
    display_density: 'comfortable',
    notifications_enabled: true,
    email_notifications: true,
    anonymous_handle: null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUserSettings(userId);
    }
  }, [userId]);

  const fetchUserSettings = async (uid: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', uid)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSettings({
          id: data.id,
          user_id: data.user_id,
          theme: data.theme,
          display_density: data.display_density,
          notifications_enabled: data.notifications_enabled,
          email_notifications: data.email_notifications,
          anonymous_handle: data.anonymous_handle || null
        });
      } else {
        const defaultSettings: UserSettings = {
          user_id: uid,
          theme: 'system',
          display_density: 'comfortable',
          notifications_enabled: true,
          email_notifications: true,
          anonymous_handle: null
        };
        
        await createUserSettings(defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (error: any) {
      console.error('Error fetching user settings:', error);
      toast({
        title: 'Error loading settings',
        description: error.message || 'Failed to load user settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createUserSettings = async (newSettings: UserSettings) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .insert({
          user_id: newSettings.user_id,
          theme: newSettings.theme,
          display_density: newSettings.display_density,
          notifications_enabled: newSettings.notifications_enabled,
          email_notifications: newSettings.email_notifications,
          anonymous_handle: newSettings.anonymous_handle
        });
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Error creating user settings:', error);
      toast({
        title: 'Error creating settings',
        description: error.message || 'Failed to create user settings',
        variant: 'destructive'
      });
      return false;
    }
  };

  const updateUserSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!settings.id) return false;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_settings')
        .update({
          ...updatedSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);
      
      if (error) throw error;
      
      setSettings(prev => ({ ...prev, ...updatedSettings }));
      
      toast({
        title: 'Settings updated',
        description: 'Your settings have been saved successfully',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating user settings:', error);
      toast({
        title: 'Error updating settings',
        description: error.message || 'Failed to update user settings',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, updateUserSettings, refetch: () => userId && fetchUserSettings(userId) };
};
