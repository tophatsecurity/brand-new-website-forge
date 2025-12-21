
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AppRole = 'admin' | 'user' | 'moderator' | 'var' | 'customer_rep' | 'customer' | 'account_rep' | 'marketing';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRoles: AppRole[];
  activeRole: AppRole | null;
  setActiveRole: (role: AppRole) => void;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateUserRole: (userId: string, role: string) => Promise<{ error: any }>;
  setUserAsAdmin: (userId: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [activeRole, setActiveRole] = useState<AppRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserRoles(session.user.id);
        } else {
          setUserRoles([]);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      // Fetch roles using the get_my_roles function
      const { data, error } = await supabase.rpc('get_my_roles');
      
      if (error) {
        console.error("Error fetching user roles:", error);
        toast({
          title: "Error loading user roles",
          description: error.message,
          variant: "destructive"
        });
        setUserRoles([]);
        setIsAdmin(false);
      } else {
        const roles = data || [];
        setUserRoles(roles);
        setIsAdmin(roles.includes('admin'));
        // Set default active role (highest privilege first)
        if (roles.includes('admin')) {
          setActiveRole('admin');
        } else if (roles.includes('account_rep')) {
          setActiveRole('account_rep');
        } else if (roles.includes('marketing')) {
          setActiveRole('marketing');
        } else if (roles.includes('var')) {
          setActiveRole('var');
        } else if (roles.includes('customer_rep')) {
          setActiveRole('customer_rep');
        } else if (roles.includes('customer')) {
          setActiveRole('customer');
        } else if (roles.length > 0) {
          setActiveRole(roles[0] as AppRole);
        }
      }
    } catch (err: any) {
      console.error("Exception fetching user roles:", err);
      setUserRoles([]);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          approved: false,
          role: 'user'
        }
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Function to update user role
  const updateUserRole = async (userId: string, role: string) => {
    try {
      // First update the Supabase auth metadata
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role }
      });
      
      if (authError) throw authError;
      
      // Then update the role in our custom user_roles table
      // First delete existing admin role if needed
      if (role === 'admin') {
        const { error } = await supabase.rpc('promote_to_admin', { 
          user_email: (await supabase.auth.admin.getUserById(userId)).data.user?.email 
        });
        if (error) throw error;
      }
      
      return { error: null };
    } catch (error) {
      console.error("Error updating user role:", error);
      return { error };
    }
  };

  // Specific function to set a user as admin
  const setUserAsAdmin = async (userId: string) => {
    return updateUserRole(userId, 'admin');
  };

  const value = {
    session,
    user,
    userRoles,
    activeRole,
    setActiveRole,
    isAdmin,
    signIn,
    signUp,
    signOut,
    loading,
    updateUserRole,
    setUserAsAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
