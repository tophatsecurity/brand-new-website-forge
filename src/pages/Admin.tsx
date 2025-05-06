
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Fallback data in case no licenses are found
  const fallbackDistribution = [
    { name: 'No Data', value: 1, color: '#CBD5E1' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-40 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="h-20 animate-pulse bg-muted rounded-md"></div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card className="col-span-1">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-muted-foreground">Total Licenses</span>
                        <span className="font-medium">{stats.totalLicenses}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-muted-foreground">Total Seats Licensed</span>
                        <span className="font-medium">{stats.totalSeatsLicensed}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
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
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">System Information</h3>
                  <p className="text-muted-foreground mb-4">
                    Welcome to the TopHat Security admin dashboard. Use the navigation bar above to access
                    different admin sections. Below is a summary of your system's current status.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>Last updated: {new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <span>Database status: Operational</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
