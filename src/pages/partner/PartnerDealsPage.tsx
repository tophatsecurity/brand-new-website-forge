import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Handshake, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  User,
  Building2,
  Filter
} from 'lucide-react';
import { useCRMDeals, useCRMContacts, useCRMAccounts, CRMDeal } from '@/hooks/useCRM';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuditLog } from '@/hooks/useAuditLog';

const dealStages = [
  { value: 'qualification', label: 'Qualification', color: 'bg-gray-500' },
  { value: 'discovery', label: 'Discovery', color: 'bg-blue-500' },
  { value: 'proposal', label: 'Proposal', color: 'bg-yellow-500' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { value: 'closed_won', label: 'Closed Won', color: 'bg-green-500' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'bg-red-500' },
];

const PartnerDealsPage = () => {
  const { user, activeRole, userRoles } = useAuth();
  const { logAudit } = useAuditLog();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedDealIds, setSelectedDealIds] = useState<string[]>([]);
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<CRMDeal | null>(null);
  
  const { data: deals = [], createDeal, updateDeal, deleteDeal } = useCRMDeals();
  const { data: contacts = [] } = useCRMContacts();
  const { data: accounts = [] } = useCRMAccounts();
  
  // Form state
  const [dealForm, setDealForm] = useState({
    name: '',
    description: '',
    amount: 0,
    stage: 'qualification' as 'qualification' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost',
    contact_id: '',
    account_id: '',
    expected_close_date: '',
    probability: 10,
    lead_source: '',
    next_step: '',
    notes: '',
    competitors: [] as string[],
  });

  // Check if user has partner/var role
  const allowedRoles = ['admin', 'var', 'customer_rep'];
  if (!user || !userRoles.some(r => allowedRoles.includes(r))) {
    return <Navigate to="/" />;
  }

  const resetForm = () => {
    setDealForm({
      name: '',
      description: '',
      amount: 0,
      stage: 'qualification' as 'qualification' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost',
      contact_id: '',
      account_id: '',
      expected_close_date: '',
      probability: 10,
      lead_source: '',
      next_step: '',
      notes: '',
      competitors: [],
    });
  };

  const handleCreateDeal = async () => {
    const dealData: any = { ...dealForm, amount: Number(dealForm.amount) };
    if (!dealData.contact_id) delete dealData.contact_id;
    if (!dealData.account_id) delete dealData.account_id;
    if (!dealData.expected_close_date) delete dealData.expected_close_date;
    
    await createDeal.mutateAsync(dealData);
    await logAudit({ action: 'create', entityType: 'deal', entityName: dealForm.name, newValues: dealData });
    setShowCreateDialog(false);
    resetForm();
  };

  const handleEditDeal = async () => {
    if (!selectedDeal) return;
    
    const updates: any = { ...dealForm, amount: Number(dealForm.amount) };
    if (!updates.contact_id) updates.contact_id = null;
    if (!updates.account_id) updates.account_id = null;
    if (!updates.expected_close_date) updates.expected_close_date = null;
    
    await updateDeal.mutateAsync({ id: selectedDeal.id, ...updates });
    await logAudit({ action: 'update', entityType: 'deal', entityId: selectedDeal.id, entityName: dealForm.name, oldValues: selectedDeal, newValues: updates });
    setShowEditDialog(false);
    setSelectedDeal(null);
    resetForm();
  };

  const handleDeleteDeal = async () => {
    if (!selectedDeal) return;
    
    await deleteDeal.mutateAsync(selectedDeal.id);
    await logAudit({ action: 'delete', entityType: 'deal', entityId: selectedDeal.id, entityName: selectedDeal.name });
    setShowDeleteDialog(false);
    setSelectedDeal(null);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedDealIds) {
      const deal = deals.find(d => d.id === id);
      await deleteDeal.mutateAsync(id);
      if (deal) {
        await logAudit({ action: 'delete', entityType: 'deal', entityId: id, entityName: deal.name });
      }
    }
    setSelectedDealIds([]);
  };

  const openEditDialog = (deal: CRMDeal) => {
    setSelectedDeal(deal);
    setDealForm({
      name: deal.name,
      description: deal.description || '',
      amount: deal.amount,
      stage: deal.stage,
      contact_id: deal.contact_id || '',
      account_id: deal.account_id || '',
      expected_close_date: deal.expected_close_date || '',
      probability: deal.probability,
      lead_source: deal.lead_source || '',
      next_step: deal.next_step || '',
      notes: deal.notes || '',
      competitors: deal.competitors || [],
    });
    setShowEditDialog(true);
  };

  const openViewDialog = (deal: CRMDeal) => {
    setSelectedDeal(deal);
    setShowViewDialog(true);
  };

  const openDeleteDialog = (deal: CRMDeal) => {
    setSelectedDeal(deal);
    setShowDeleteDialog(true);
  };

  // Filtering
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [deals, searchTerm, stageFilter]);

  // Stats
  const stats = useMemo(() => {
    const pipelineValue = deals
      .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    const closedWonValue = deals
      .filter(d => d.stage === 'closed_won')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    const openDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length;
    
    return { pipelineValue, closedWonValue, openDeals, totalDeals: deals.length };
  }, [deals]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDealIds(filteredDeals.map(d => d.id));
    } else {
      setSelectedDealIds([]);
    }
  };

  const handleSelectDeal = (dealId: string, checked: boolean) => {
    if (checked) {
      setSelectedDealIds(prev => [...prev, dealId]);
    } else {
      setSelectedDealIds(prev => prev.filter(id => id !== dealId));
    }
  };

  const allSelected = filteredDeals.length > 0 && selectedDealIds.length === filteredDeals.length;

  const getDealStageBadge = (stage: string) => {
    const stageInfo = dealStages.find(s => s.value === stage);
    return (
      <Badge className={`${stageInfo?.color || 'bg-gray-500'} text-white`}>
        {stageInfo?.label || stage.replace('_', ' ')}
      </Badge>
    );
  };

  const getContactName = (contactId: string | null) => {
    if (!contactId) return '-';
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.first_name} ${contact.last_name}` : '-';
  };

  const getAccountName = (accountId: string | null) => {
    if (!accountId) return '-';
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : '-';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Handshake className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Deal Registration</h1>
              <p className="text-muted-foreground">Register and manage partner deals linked to contacts</p>
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
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <Handshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeals}</div>
              <p className="text-xs text-muted-foreground">{stats.openDeals} open</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pipelineValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.closedWonValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalDeals > 0 
                  ? Math.round((deals.filter(d => d.stage === 'closed_won').length / stats.totalDeals) * 100) 
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search deals..." 
                className="pl-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {dealStages.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {selectedDealIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedDealIds.length})
              </Button>
            )}
            <Button onClick={() => { resetForm(); setShowCreateDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Register Deal
            </Button>
          </div>
        </div>

        {/* Deals Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Deal Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Expected Close</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No deals found. Register your first deal to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedDealIds.includes(deal.id)}
                          onCheckedChange={(checked) => handleSelectDeal(deal.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{deal.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {getContactName(deal.contact_id)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          {getAccountName(deal.account_id)}
                        </div>
                      </TableCell>
                      <TableCell>{getDealStageBadge(deal.stage)}</TableCell>
                      <TableCell>${(deal.amount || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        {deal.expected_close_date 
                          ? format(new Date(deal.expected_close_date), 'MMM d, yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>{deal.probability}%</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewDialog(deal)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(deal)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Deal
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(deal)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Deal
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Deal Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          setSelectedDeal(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showEditDialog ? 'Edit Deal' : 'Register New Deal'}</DialogTitle>
            <DialogDescription>
              {showEditDialog ? 'Update deal information' : 'Register a new partner deal'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Deal Name *</Label>
                <Input
                  id="name"
                  value={dealForm.name}
                  onChange={(e) => setDealForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enterprise License Deal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={dealForm.amount}
                  onChange={(e) => setDealForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select 
                  value={dealForm.stage} 
                  onValueChange={(value: any) => setDealForm(prev => ({ ...prev, stage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dealStages.map(stage => (
                      <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min={0}
                  max={100}
                  value={dealForm.probability}
                  onChange={(e) => setDealForm(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Select 
                  value={dealForm.contact_id} 
                  onValueChange={(value) => setDealForm(prev => ({ ...prev, contact_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No contact</SelectItem>
                    {contacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.first_name} {contact.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <Select 
                  value={dealForm.account_id} 
                  onValueChange={(value) => setDealForm(prev => ({ ...prev, account_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No account</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expected_close">Expected Close Date</Label>
                <Input
                  id="expected_close"
                  type="date"
                  value={dealForm.expected_close_date}
                  onChange={(e) => setDealForm(prev => ({ ...prev, expected_close_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead_source">Lead Source</Label>
                <Input
                  id="lead_source"
                  value={dealForm.lead_source}
                  onChange={(e) => setDealForm(prev => ({ ...prev, lead_source: e.target.value }))}
                  placeholder="e.g., Referral, Website"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={dealForm.description}
                onChange={(e) => setDealForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deal description..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_step">Next Step</Label>
              <Input
                id="next_step"
                value={dealForm.next_step}
                onChange={(e) => setDealForm(prev => ({ ...prev, next_step: e.target.value }))}
                placeholder="e.g., Schedule demo call"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={dealForm.notes}
                onChange={(e) => setDealForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setShowEditDialog(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={showEditDialog ? handleEditDeal : handleCreateDeal} disabled={!dealForm.name}>
              {showEditDialog ? 'Save Changes' : 'Register Deal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Deal Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedDeal?.name}</DialogTitle>
            <DialogDescription>Deal details</DialogDescription>
          </DialogHeader>
          {selectedDeal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Stage</Label>
                  <div className="mt-1">{getDealStageBadge(selectedDeal.stage)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-medium">${(selectedDeal.amount || 0).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Probability</Label>
                  <p>{selectedDeal.probability}%</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Expected Close</Label>
                  <p>{selectedDeal.expected_close_date 
                    ? format(new Date(selectedDeal.expected_close_date), 'MMM d, yyyy')
                    : '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p>{getContactName(selectedDeal.contact_id)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Account</Label>
                  <p>{getAccountName(selectedDeal.account_id)}</p>
                </div>
              </div>
              {selectedDeal.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedDeal.description}</p>
                </div>
              )}
              {selectedDeal.next_step && (
                <div>
                  <Label className="text-muted-foreground">Next Step</Label>
                  <p className="text-sm">{selectedDeal.next_step}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDealIds.length > 0 
                ? `This will permanently delete ${selectedDealIds.length} selected deal(s).`
                : `This will permanently delete "${selectedDeal?.name}".`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={selectedDealIds.length > 0 ? handleBulkDelete : handleDeleteDeal}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default PartnerDealsPage;
