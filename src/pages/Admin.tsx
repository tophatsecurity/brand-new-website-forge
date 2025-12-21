import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import StatCard from '@/components/admin/dashboard/StatCard';
import LicenseDistributionChart from '@/components/admin/dashboard/LicenseDistributionChart';
import { useRoleDashboard } from '@/hooks/useRoleDashboard';
import { useLicenseDistribution } from '@/hooks/useLicenseDistribution';
import { 
  Users, 
  Key, 
  Download, 
  User, 
  Calendar, 
  Database, 
  Building2, 
  UserPlus,
  Target,
  TrendingUp,
  ClipboardList,
  Briefcase
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const { user, activeRole } = useAuth();
  const { stats, loading, permissions } = useRoleDashboard();
  const { distribution, loading: distributionLoading } = useLicenseDistribution();

  // Allow access for admin and roles with dashboard access
  const allowedRoles = ['admin', 'account_rep', 'marketing', 'customer_rep', 'var'];
  if (!user || !activeRole || !allowedRoles.includes(activeRole)) {
    return <Navigate to="/" />;
  }

  const fallbackDistribution = [
    { name: 'No Data', value: 1, color: '#CBD5E1' }
  ];

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      account_rep: 'bg-emerald-100 text-emerald-800',
      marketing: 'bg-pink-100 text-pink-800',
      customer_rep: 'bg-cyan-100 text-cyan-800',
      var: 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrator',
      account_rep: 'Account Rep',
      marketing: 'Marketing',
      customer_rep: 'Customer Rep',
      var: 'VAR Partner'
    };
    return labels[role] || role;
  };

  return (
    <AdminLayout title={permissions.dashboardTitle}>
      {/* Role indicator */}
      <div className="mb-4 flex items-center gap-3">
        <Badge variant="outline" className={getRoleBadgeColor(activeRole)}>
          {getRoleLabel(activeRole)}
        </Badge>
        <span className="text-sm text-muted-foreground">{permissions.dashboardDescription}</span>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="h-16 animate-pulse bg-muted rounded-md"></div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Admin-only stats */}
          {permissions.canViewAllUsers && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-4">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={Users}
                description="All registered users"
              />
              <StatCard 
                title="Pending Approvals" 
                value={stats.pendingUsers} 
                icon={User}
                description="Users awaiting approval"
                trend={stats.pendingUsers > 0 ? { value: stats.pendingUsers, isPositive: false } : undefined}
              />
              <StatCard 
                title="Active Licenses" 
                value={stats.activeLicenses} 
                icon={Key}
                description="Currently active product licenses"
              />
              <StatCard 
                title="Total Downloads" 
                value={stats.totalDownloads} 
                icon={Download}
                description="Product downloads available"
              />
            </div>
          )}

          {/* CRM Stats - for roles with CRM access */}
          {permissions.canViewCRM && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-4">
              <StatCard 
                title="Total Accounts" 
                value={stats.totalAccounts} 
                icon={Building2}
                description="Customer accounts in CRM"
              />
              <StatCard 
                title="Total Contacts" 
                value={stats.totalContacts} 
                icon={Users}
                description="Contacts in database"
              />
              <StatCard 
                title="Active Deals" 
                value={stats.totalDeals} 
                icon={Target}
                description="Deals in pipeline"
              />
              <StatCard 
                title="Onboarding Active" 
                value={stats.onboardingInProgress} 
                icon={ClipboardList}
                description="Customers being onboarded"
              />
            </div>
          )}

          {/* My Stats - personal ownership stats */}
          {permissions.canViewCRM && !permissions.canViewAllUsers && (
            <div className="grid gap-3 md:grid-cols-3 mb-4">
              <StatCard 
                title="My Accounts" 
                value={stats.myAccounts} 
                icon={Briefcase}
                description="Accounts you own"
              />
              <StatCard 
                title="My Contacts" 
                value={stats.myContacts} 
                icon={UserPlus}
                description="Contacts you manage"
              />
              <StatCard 
                title="My Deals" 
                value={stats.myDeals} 
                icon={TrendingUp}
                description="Deals you're working on"
              />
            </div>
          )}

          {/* License stats - for roles with license access */}
          {permissions.canViewAllLicenses && !permissions.canViewAllUsers && (
            <div className="grid gap-3 md:grid-cols-3 mb-4">
              <StatCard 
                title="Total Licenses" 
                value={stats.totalLicenses} 
                icon={Key}
                description="All product licenses"
              />
              <StatCard 
                title="Active Licenses" 
                value={stats.activeLicenses} 
                icon={Key}
                description="Currently active"
              />
              <StatCard 
                title="Total Seats" 
                value={stats.totalSeatsLicensed} 
                icon={Users}
                description="Licensed seats"
              />
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {/* Key Metrics - Admin and license roles */}
            {permissions.canViewAllLicenses && (
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">License Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="text-muted-foreground">Total Licenses</span>
                      <span className="font-medium">{stats.totalLicenses}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="text-muted-foreground">Total Seats Licensed</span>
                      <span className="font-medium">{stats.totalSeatsLicensed}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="text-muted-foreground">License Utilization</span>
                      <span className="font-medium">
                        {stats.totalLicenses ? 
                          `${Math.round((stats.activeLicenses / stats.totalLicenses) * 100)}%` : 
                          'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {permissions.canViewAllLicenses && (
              <LicenseDistributionChart 
                data={distributionLoading ? fallbackDistribution : 
                      distribution.length === 0 ? fallbackDistribution : distribution} 
              />
            )}

            {/* CRM Summary - for CRM roles */}
            {permissions.canViewCRM && (
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">CRM Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="text-muted-foreground">Accounts</span>
                      <span className="font-medium">{stats.totalAccounts}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="text-muted-foreground">Contacts</span>
                      <span className="font-medium">{stats.totalContacts}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="text-muted-foreground">Active Deals</span>
                      <span className="font-medium">{stats.totalDeals}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Onboarding</span>
                      <span className="font-medium">{stats.onboardingInProgress}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-2">System Information</h3>
              <p className="text-muted-foreground mb-2">
                Welcome to the TopHat Security dashboard. Use the sidebar to navigate to different sections.
              </p>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last updated: {new Date().toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Database status: Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </AdminLayout>
  );
};

export default Admin;
