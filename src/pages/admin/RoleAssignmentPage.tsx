import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Save, X, Shield, User, Users, Briefcase, Headphones, UserCheck, Megaphone, UserCog } from 'lucide-react';
import { APP_ROLES } from '@/components/admin/dialogs/ChangeRoleDialog';

interface UserWithRoles {
  id: string;
  email: string;
  full_name?: string;
  roles: string[];
}

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  user: User,
  moderator: UserCheck,
  var: Briefcase,
  customer_rep: Headphones,
  customer: Users,
  account_rep: UserCog,
  marketing: Megaphone,
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  moderator: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  var: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  customer_rep: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  customer: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  account_rep: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  marketing: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
};

const RoleAssignmentPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingChanges, setPendingChanges] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  const fetchUsersWithRoles = async () => {
    try {
      setLoading(true);
      
      // Fetch users via edge function
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke('admin-list-users', {
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
      });

      if (response.error) throw response.error;

      const authUsers = response.data?.users || [];

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map roles to users
      const rolesByUser: Record<string, string[]> = {};
      rolesData?.forEach((r) => {
        if (!rolesByUser[r.user_id]) {
          rolesByUser[r.user_id] = [];
        }
        rolesByUser[r.user_id].push(r.role);
      });

      const usersWithRoles: UserWithRoles[] = authUsers.map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || u.user_metadata?.first_name 
          ? `${u.user_metadata?.first_name || ''} ${u.user_metadata?.last_name || ''}`.trim()
          : undefined,
        roles: rolesByUser[u.id] || ['user'],
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error loading users',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (userId: string, role: string, currentRoles: string[]) => {
    const pending = pendingChanges[userId] || [...currentRoles];
    
    if (pending.includes(role)) {
      // Don't allow removing the last role
      if (pending.length === 1) {
        toast({
          title: 'Cannot remove last role',
          description: 'Users must have at least one role assigned.',
          variant: 'destructive',
        });
        return;
      }
      setPendingChanges({
        ...pendingChanges,
        [userId]: pending.filter((r) => r !== role),
      });
    } else {
      setPendingChanges({
        ...pendingChanges,
        [userId]: [...pending, role],
      });
    }
  };

  const hasChanges = (userId: string, currentRoles: string[]) => {
    const pending = pendingChanges[userId];
    if (!pending) return false;
    
    const currentSet = new Set(currentRoles);
    const pendingSet = new Set(pending);
    
    if (currentSet.size !== pendingSet.size) return true;
    for (const role of currentSet) {
      if (!pendingSet.has(role)) return true;
    }
    return false;
  };

  const handleSaveRoles = async (userId: string, currentRoles: string[]) => {
    const newRoles = pendingChanges[userId];
    if (!newRoles || !hasChanges(userId, currentRoles)) return;

    try {
      setSaving(userId);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('admin-user-actions', {
        body: {
          action: 'updateRoles',
          userId,
          roles: newRoles,
        },
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: 'Roles updated',
        description: 'User roles have been updated successfully.',
      });

      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, roles: newRoles } : u));
      
      // Clear pending changes for this user
      const newPending = { ...pendingChanges };
      delete newPending[userId];
      setPendingChanges(newPending);
    } catch (error: any) {
      console.error('Error updating roles:', error);
      toast({
        title: 'Error updating roles',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const handleCancelChanges = (userId: string) => {
    const newPending = { ...pendingChanges };
    delete newPending[userId];
    setPendingChanges(newPending);
  };

  const getRolesForUser = (userId: string, originalRoles: string[]) => {
    return pendingChanges[userId] || originalRoles;
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout title="Role Assignment">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Role Management
            </CardTitle>
            <CardDescription>
              Assign and manage multiple roles for each user. Changes are saved per-user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading users...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">User</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => {
                      const currentRoles = getRolesForUser(u.id, u.roles);
                      const changed = hasChanges(u.id, u.roles);
                      
                      return (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{u.email}</div>
                              {u.full_name && (
                                <div className="text-sm text-muted-foreground">{u.full_name}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {APP_ROLES.map((role) => {
                                const isActive = currentRoles.includes(role.value);
                                const Icon = ROLE_ICONS[role.value] || User;
                                
                                return (
                                  <label
                                    key={role.value}
                                    className={`
                                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all
                                      ${isActive ? ROLE_COLORS[role.value] : 'bg-muted text-muted-foreground opacity-50 hover:opacity-75'}
                                    `}
                                  >
                                    <Checkbox
                                      checked={isActive}
                                      onCheckedChange={() => handleRoleToggle(u.id, role.value, u.roles)}
                                      className="h-3 w-3"
                                    />
                                    <Icon className="h-3 w-3" />
                                    {role.label}
                                  </label>
                                );
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {changed && (
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCancelChanges(u.id)}
                                  disabled={saving === u.id}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveRoles(u.id, u.roles)}
                                  disabled={saving === u.id}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  {saving === u.id ? 'Saving...' : 'Save'}
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Role Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {APP_ROLES.map((role) => {
                const Icon = ROLE_ICONS[role.value] || User;
                return (
                  <div key={role.value} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge className={ROLE_COLORS[role.value]}>
                      <Icon className="h-3 w-3 mr-1" />
                      {role.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RoleAssignmentPage;
