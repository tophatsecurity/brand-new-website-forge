import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Handshake, 
  DollarSign, 
  TrendingUp, 
  Target,
  Users,
  FileText,
  Calculator,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useCRMDeals, useCRMContacts, useCRMAccounts } from '@/hooks/useCRM';

const PartnerDashboardPage = () => {
  const { user, activeRole, userRoles, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const { data: deals = [] } = useCRMDeals();
  const { data: contacts = [] } = useCRMContacts();
  const { data: accounts = [] } = useCRMAccounts();

  // Check if user has partner/var role
  const allowedRoles = ['admin', 'var', 'customer_rep'];
  if (!user || !userRoles.some(r => allowedRoles.includes(r))) {
    return <Navigate to="/" />;
  }

  // Stats calculations
  const stats = useMemo(() => {
    const pipelineValue = deals
      .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    const closedWonValue = deals
      .filter(d => d.stage === 'closed_won')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    const openDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length;
    
    return { 
      pipelineValue, 
      closedWonValue, 
      openDeals, 
      totalDeals: deals.length,
      totalContacts: contacts.length,
      totalAccounts: accounts.length
    };
  }, [deals, contacts, accounts]);

  const quickActions = [
    { 
      title: 'Register New Deal', 
      description: 'Create a new deal registration', 
      icon: Handshake, 
      href: '/partner/deals',
      color: 'bg-blue-500'
    },
    { 
      title: 'Price Calculator', 
      description: 'Build quotes with SKU pricing', 
      icon: Calculator, 
      href: '/partner/calculator',
      color: 'bg-green-500'
    },
    { 
      title: 'View Accounts', 
      description: 'Manage customer accounts', 
      icon: Building2, 
      href: '/admin/crm',
      color: 'bg-purple-500'
    },
    { 
      title: 'View Contacts', 
      description: 'Manage contact database', 
      icon: Users, 
      href: '/admin/crm',
      color: 'bg-orange-500'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Handshake className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Partner Portal</h1>
              <p className="text-muted-foreground">Manage deals, quotes, and customer relationships</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Partner Portal
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pipelineValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.openDeals} open deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Closed Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.closedWonValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total closed won</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeals}</div>
              <p className="text-xs text-muted-foreground">All registered deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAccounts}</div>
              <p className="text-xs text-muted-foreground">{stats.totalContacts} contacts</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Card 
                key={action.title} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(action.href)}
              >
                <CardHeader className="pb-2">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="p-0">
                    Go <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Deals</CardTitle>
              <CardDescription>Your latest deal registrations</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/partner/deals')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {deals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Handshake className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No deals registered yet</p>
                <Button className="mt-4" onClick={() => navigate('/partner/deals')}>
                  Register Your First Deal
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {deals.slice(0, 5).map(deal => (
                  <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{deal.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{deal.stage.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(deal.amount || 0).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{deal.probability}% probability</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PartnerDashboardPage;
