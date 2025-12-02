import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import StatCard from '@/components/admin/dashboard/StatCard';
import LicenseDistributionChart from '@/components/admin/dashboard/LicenseDistributionChart';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useLicenseDistribution } from '@/hooks/useLicenseDistribution';
import { Users, Key, Download, User, Calendar, Database } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { stats, loading } = useAdminDashboard();
  const { distribution, loading: distributionLoading } = useLicenseDistribution();
  
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const fallbackDistribution = [
    { name: 'No Data', value: 1, color: '#CBD5E1' }
  ];

  return (
    <AdminLayout title="Dashboard">
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
              trend={stats.pendingUsers > 0 ? { value: 10, isPositive: false } : undefined}
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
          
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
            <Card className="col-span-1">
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
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
            
            <LicenseDistributionChart 
              data={distributionLoading ? fallbackDistribution : 
                    distribution.length === 0 ? fallbackDistribution : distribution} 
            />
          </div>
          
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-2">System Information</h3>
              <p className="text-muted-foreground mb-2">
                Welcome to the TopHat Security admin dashboard. Use the sidebar to navigate admin sections.
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
