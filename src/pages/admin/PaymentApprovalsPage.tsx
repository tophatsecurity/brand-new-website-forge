import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Clock,
  Building2,
  Mail,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface AccountPaymentStatus {
  id: string;
  name: string;
  email: string | null;
  account_type: string;
  payment_verified: boolean;
  payment_verified_at: string | null;
  payment_approved_by: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  onboarding_user_email?: string;
}

const PaymentApprovalsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<AccountPaymentStatus | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  // Fetch accounts with payment status
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['payment-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_accounts')
        .select(`
          id,
          name,
          email,
          account_type,
          payment_verified,
          payment_verified_at,
          payment_approved_by,
          stripe_customer_id,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AccountPaymentStatus[];
    }
  });

  // Approve payment mutation
  const approveMutation = useMutation({
    mutationFn: async ({ accountId, notes }: { accountId: string; notes: string }) => {
      const { error } = await supabase
        .from('crm_accounts')
        .update({
          payment_verified: true,
          payment_verified_at: new Date().toISOString(),
          payment_approved_by: user?.email || 'admin',
          account_type: 'customer',
          notes: notes ? `Payment approved: ${notes}` : 'Payment manually approved by TopHat team'
        })
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-approvals'] });
      toast.success('Account approved for paid features');
      setShowApprovalDialog(false);
      setSelectedAccount(null);
      setApprovalNotes('');
    },
    onError: (error: any) => {
      toast.error(`Failed to approve: ${error.message}`);
    }
  });

  // Revoke payment mutation
  const revokeMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('crm_accounts')
        .update({
          payment_verified: false,
          payment_verified_at: null,
          payment_approved_by: null,
          account_type: 'free'
        })
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-approvals'] });
      toast.success('Paid access revoked');
    },
    onError: (error: any) => {
      toast.error(`Failed to revoke: ${error.message}`);
    }
  });

  const handleApprove = (account: AccountPaymentStatus) => {
    setSelectedAccount(account);
    setShowApprovalDialog(true);
  };

  const handleConfirmApproval = () => {
    if (!selectedAccount) return;
    approveMutation.mutate({ accountId: selectedAccount.id, notes: approvalNotes });
  };

  const handleRevoke = (accountId: string) => {
    if (confirm('Are you sure you want to revoke paid access for this account?')) {
      revokeMutation.mutate(accountId);
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'pending') {
      return matchesSearch && !account.payment_verified && account.account_type === 'free';
    }
    if (filter === 'approved') {
      return matchesSearch && (account.payment_verified || account.account_type !== 'free');
    }
    return matchesSearch;
  });

  const pendingCount = accounts.filter(a => !a.payment_verified && a.account_type === 'free').length;
  const approvedCount = accounts.filter(a => a.payment_verified || a.account_type !== 'free').length;

  const getStatusBadge = (account: AccountPaymentStatus) => {
    if (account.payment_verified) {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    }
    if (account.stripe_customer_id) {
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">
          <CreditCard className="h-3 w-3 mr-1" />
          Has Payment
        </Badge>
      );
    }
    if (account.account_type !== 'free') {
      return (
        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30">
          <Shield className="h-3 w-3 mr-1" />
          {account.account_type}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-500/30">
        <Clock className="h-3 w-3 mr-1" />
        Free Tier
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment Approvals</h1>
            <p className="text-muted-foreground">
              Manually approve free tier users for paid feature access
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card 
            className={`cursor-pointer transition-colors ${filter === 'pending' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Free tier accounts</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${filter === 'approved' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setFilter('approved')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">With paid access</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${filter === 'all' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setFilter('all')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">All Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
              <p className="text-xs text-muted-foreground">Total CRM accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filter === 'pending' && 'Pending Approval'}
              {filter === 'approved' && 'Approved Accounts'}
              {filter === 'all' && 'All Accounts'}
            </CardTitle>
            <CardDescription>
              {filter === 'pending' && 'Free tier accounts that can be manually approved for paid features'}
              {filter === 'approved' && 'Accounts with paid feature access'}
              {filter === 'all' && 'All CRM accounts with their payment status'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No accounts found</p>
                <p className="text-sm text-muted-foreground">
                  {filter === 'pending' 
                    ? 'No free tier accounts pending approval' 
                    : 'Try adjusting your search or filter'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Approved At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{account.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {account.email ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {account.email}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(account)}</TableCell>
                      <TableCell>
                        {account.payment_approved_by || '-'}
                      </TableCell>
                      <TableCell>
                        {account.payment_verified_at 
                          ? format(new Date(account.payment_verified_at), 'MMM d, yyyy')
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        {!account.payment_verified && account.account_type === 'free' ? (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(account)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        ) : account.payment_verified ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevoke(account.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Revoke
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Account for Paid Features</DialogTitle>
              <DialogDescription>
                This will grant {selectedAccount?.name} access to all paid features without requiring payment details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{selectedAccount?.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedAccount?.email || 'No email'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Approval Notes (Optional)</Label>
                <Textarea
                  placeholder="Reason for approval..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmApproval}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Approve Access
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PaymentApprovalsPage;
