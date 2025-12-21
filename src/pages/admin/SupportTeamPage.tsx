import React, { useMemo } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useSupportTeam, getRoleLabel, SUPPORT_ROLES } from '@/hooks/useSupportTeam';
import { useCRMAccounts } from '@/hooks/useCRM';
import { Users, Building2, BarChart3, UserCheck, Briefcase, HeadphonesIcon, Store } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
  const { data: supportTeam = [], isLoading: teamLoading } = useSupportTeam();
  const { data: accounts = [], isLoading: accountsLoading } = useCRMAccounts();

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

  // Workload distribution data
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

  const loading = teamLoading || accountsLoading;

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
              <CardDescription>Accounts assigned per team member</CardDescription>
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
                    return (
                      <div key={member.id} className="flex items-center gap-4">
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

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members</CardTitle>
            <CardDescription>All support team members and their assigned accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Accounts</TableHead>
                  <TableHead>Account List</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading team members...
                    </TableCell>
                  </TableRow>
                ) : teamWorkload.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No support team members found. Assign users the customer_rep, account_rep, or var role.
                    </TableCell>
                  </TableRow>
                ) : (
                  teamWorkload.map(member => {
                    const Icon = ROLE_ICONS[member.role] || Users;
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{getInitials(member.email)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            <Icon className="h-3 w-3 mr-1" />
                            {getRoleLabel(member.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.accountCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {member.accounts.length === 0 ? (
                              <span className="text-muted-foreground text-sm">No accounts assigned</span>
                            ) : (
                              member.accounts.slice(0, 5).map(acc => (
                                <Badge key={acc.id} variant="secondary" className="text-xs">
                                  {acc.name}
                                </Badge>
                              ))
                            )}
                            {member.accounts.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.accounts.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Unassigned Accounts */}
        {unassignedAccounts.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-destructive" />
                Unassigned Accounts
              </CardTitle>
              <CardDescription>
                These accounts need to be assigned to a support team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {unassignedAccounts.slice(0, 20).map(acc => (
                  <Badge key={acc.id} variant="outline" className="text-sm">
                    {acc.name}
                  </Badge>
                ))}
                {unassignedAccounts.length > 20 && (
                  <Badge variant="secondary">
                    +{unassignedAccounts.length - 20} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default SupportTeamPage;
