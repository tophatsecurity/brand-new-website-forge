import React, { useMemo, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupportTeam, getRoleLabel } from '@/hooks/useSupportTeam';
import { useCRMAccounts, CRMAccount } from '@/hooks/useCRM';
import { Users, Building2, BarChart3, UserCheck, Briefcase, HeadphonesIcon, Store, ArrowRight, X, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const ROLE_COLORS: Record<string, string> = {
  customer_rep: 'hsl(var(--chart-1))',
  account_rep: 'hsl(var(--chart-2))',
  var: 'hsl(var(--chart-3))',
  admin: 'hsl(var(--chart-4))',
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  customer_rep: HeadphonesIcon,
  account_rep: Briefcase,
  var: Store,
  admin: UserCheck,
};

const SupportTeamPage = () => {
  const queryClient = useQueryClient();
  const { data: supportTeam = [], isLoading: teamLoading } = useSupportTeam();
  const { data: accounts = [], isLoading: accountsLoading } = useCRMAccounts();
  
  // Selection state
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [targetMemberId, setTargetMemberId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [viewMode, setViewMode] = useState<'unassigned' | 'all' | string>('unassigned');

  // Calculate workload for each team member
  const teamWorkload = useMemo(() => {
    return supportTeam.map(member => {
      const assignedAccounts = accounts.filter(acc => acc.owner_id === member.id);
      return {
        ...member,
        accountCount: assignedAccounts.length,
        accounts: assignedAccounts,
      };
    });
  }, [supportTeam, accounts]);

  // Filter accounts based on view mode
  const displayedAccounts = useMemo(() => {
    if (viewMode === 'unassigned') {
      return accounts.filter(acc => !acc.owner_id);
    } else if (viewMode === 'all') {
      return accounts;
    } else {
      // View specific team member's accounts
      return accounts.filter(acc => acc.owner_id === viewMode);
    }
  }, [accounts, viewMode]);

  // Unassigned accounts
  const unassignedAccounts = useMemo(() => {
    return accounts.filter(acc => !acc.owner_id);
  }, [accounts]);

  // Role distribution data for pie chart
  const roleDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    supportTeam.forEach(member => {
      counts[member.role] = (counts[member.role] || 0) + 1;
    });
    return Object.entries(counts).map(([role, count]) => ({
      name: getRoleLabel(role),
      value: count,
      color: ROLE_COLORS[role] || 'hsl(var(--muted))',
    }));
  }, [supportTeam]);

  const maxAccounts = Math.max(...teamWorkload.map(t => t.accountCount), 1);
  const totalAssigned = accounts.length - unassignedAccounts.length;
  const avgWorkload = supportTeam.length > 0 ? Math.round(totalAssigned / supportTeam.length) : 0;

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'outline' => {
    switch (role) {
      case 'admin': return 'default';
      case 'customer_rep': return 'secondary';
      default: return 'outline';
    }
  };

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    if (checked) {
      setSelectedAccountIds(prev => [...prev, accountId]);
    } else {
      setSelectedAccountIds(prev => prev.filter(id => id !== accountId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccountIds(displayedAccounts.map(acc => acc.id));
    } else {
      setSelectedAccountIds([]);
    }
  };

  const handleAssignAccounts = async () => {
    if (selectedAccountIds.length === 0) {
      toast.error('Please select accounts to assign');
      return;
    }

    setIsAssigning(true);
    try {
      const ownerId = targetMemberId === 'unassign' ? null : targetMemberId || null;
      
      const { error } = await supabase
        .from('crm_accounts')
        .update({ owner_id: ownerId })
        .in('id', selectedAccountIds);

      if (error) throw error;

      toast.success(
        ownerId 
          ? `${selectedAccountIds.length} account(s) assigned successfully`
          : `${selectedAccountIds.length} account(s) unassigned`
      );
      
      setSelectedAccountIds([]);
      setTargetMemberId('');
      queryClient.invalidateQueries({ queryKey: ['crm-accounts'] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign accounts');
    } finally {
      setIsAssigning(false);
    }
  };

  const getOwnerName = (ownerId: string | null) => {
    if (!ownerId) return 'Unassigned';
    const member = supportTeam.find(m => m.id === ownerId);
    return member?.email || 'Unknown';
  };

  const loading = teamLoading || accountsLoading;
  const allSelected = displayedAccounts.length > 0 && selectedAccountIds.length === displayedAccounts.length;
  const someSelected = selectedAccountIds.length > 0 && selectedAccountIds.length < displayedAccounts.length;

  return (
    <AdminLayout title="Support Team">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supportTeam.length}</div>
              <p className="text-xs text-muted-foreground">Active support reps</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
              <p className="text-xs text-muted-foreground">{totalAssigned} assigned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
              <Building2 className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{unassignedAccounts.length}</div>
              <p className="text-xs text-muted-foreground">Need assignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Workload</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgWorkload}</div>
              <p className="text-xs text-muted-foreground">Accounts per rep</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Distribution</CardTitle>
              <CardDescription>Team members by role</CardDescription>
            </CardHeader>
            <CardContent>
              {roleDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  No team members yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workload Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Workload Distribution</CardTitle>
              <CardDescription>Click on a team member to view their accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : teamWorkload.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No team members found</div>
                ) : (
                  teamWorkload.map(member => {
                    const Icon = ROLE_ICONS[member.role] || Users;
                    const percentage = maxAccounts > 0 ? (member.accountCount / maxAccounts) * 100 : 0;
                    const isSelected = viewMode === member.id;
                    return (
                      <div 
                        key={member.id} 
                        className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setViewMode(isSelected ? 'unassigned' : member.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(member.email)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium truncate">{member.email}</span>
                            <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                              <Icon className="h-3 w-3 mr-1" />
                              {getRoleLabel(member.role)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-16 text-right">
                              {member.accountCount} accounts
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Assignment Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Account Assignment</CardTitle>
                <CardDescription>
                  Select accounts and assign them to team members
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={viewMode} onValueChange={setViewMode}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned Only</SelectItem>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {teamWorkload.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.email.split('@')[0]} ({member.accountCount})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bulk Action Bar */}
            {selectedAccountIds.length > 0 && (
              <div className="flex items-center gap-4 p-3 mb-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedAccountIds.length} account{selectedAccountIds.length !== 1 ? 's' : ''} selected
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Select value={targetMemberId} onValueChange={setTargetMemberId}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassign">
                      <span className="text-destructive">Unassign</span>
                    </SelectItem>
                    {supportTeam.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.email} ({getRoleLabel(member.role)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAssignAccounts} 
                  disabled={!targetMemberId || isAssigning}
                  size="sm"
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Apply'
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedAccountIds([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      ref={(el) => {
                        if (el) (el as any).indeterminate = someSelected;
                      }}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Current Owner</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading accounts...
                    </TableCell>
                  </TableRow>
                ) : displayedAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {viewMode === 'unassigned' 
                        ? 'No unassigned accounts. All accounts have been assigned!'
                        : 'No accounts found for this filter.'
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedAccounts.map(account => (
                    <TableRow 
                      key={account.id}
                      className={selectedAccountIds.includes(account.id) ? 'bg-primary/5' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedAccountIds.includes(account.id)}
                          onCheckedChange={(checked) => handleSelectAccount(account.id, !!checked)}
                          aria-label={`Select ${account.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {account.account_type || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {account.industry || '-'}
                      </TableCell>
                      <TableCell>
                        {account.owner_id ? (
                          <Badge variant="secondary" className="text-xs">
                            {getOwnerName(account.owner_id)}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                          {account.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SupportTeamPage;
