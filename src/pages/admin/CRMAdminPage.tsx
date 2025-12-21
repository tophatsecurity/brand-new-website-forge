import AdminLayout from '@/components/layouts/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Activity,
  Plus,
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCRMAccounts, useCRMContacts, useCRMDeals, useCRMActivities, useCRMStats, CRMAccount, CRMContact } from '@/hooks/useCRM';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import AccountDetailDialog from '@/components/admin/crm/AccountDetailDialog';
import BulkContactImportDialog from '@/components/admin/crm/BulkContactImportDialog';
import ContactFilters, { ContactFiltersState } from '@/components/admin/crm/ContactFilters';
import ContactDetailDialog from '@/components/admin/crm/ContactDetailDialog';
import ContactBulkActions from '@/components/admin/crm/ContactBulkActions';
import CreateAccountsFromContacts from '@/components/admin/crm/CreateAccountsFromContacts';
import { Checkbox } from '@/components/ui/checkbox';

const initialContactFilters: ContactFiltersState = {
  status: 'all',
  leadSource: 'all',
  industry: 'all',
  priority: 'all',
  interactionType: 'all',
  accountType: 'all',
  hasEmail: 'all',
  hasPhone: 'all',
  tags: 'all',
};

const CRMAdminPage = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<CRMAccount | null>(null);
  const [showAccountDetail, setShowAccountDetail] = useState(false);
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [contactFilters, setContactFilters] = useState<ContactFiltersState>(initialContactFilters);
  
  const { data: stats, isLoading: statsLoading } = useCRMStats();
  const { data: accounts = [], isLoading: accountsLoading, createAccount, deleteAccount } = useCRMAccounts();
  const { data: contacts = [], isLoading: contactsLoading, createContact, deleteContact } = useCRMContacts();
  const { data: deals = [], isLoading: dealsLoading, createDeal, deleteDeal } = useCRMDeals();
  const { data: activities = [], isLoading: activitiesLoading, createActivity, deleteActivity } = useCRMActivities();

  // Form states
  const [accountForm, setAccountForm] = useState({ name: '', industry: '', email: '', phone: '', website: '', account_type: 'free' as const });
  const [contactForm, setContactForm] = useState({ first_name: '', last_name: '', email: '', phone: '', job_title: '', account_id: '' });
  const [dealForm, setDealForm] = useState({ name: '', amount: 0, stage: 'qualification' as const, account_id: '', expected_close_date: '' });
  const [activityForm, setActivityForm] = useState({ subject: '', activity_type: 'call' as const, description: '', account_id: '', due_date: '' });

  const handleViewAccount = (account: CRMAccount) => {
    setSelectedAccount(account);
    setShowAccountDetail(true);
  };

  const handleViewContact = (contact: CRMContact) => {
    setSelectedContact(contact);
    setShowContactDetail(true);
  };

  const handleCreateAccount = async () => {
    await createAccount.mutateAsync(accountForm);
    setShowAccountDialog(false);
    setAccountForm({ name: '', industry: '', email: '', phone: '', website: '', account_type: 'free' });
  };

  const handleCreateContact = async () => {
    await createContact.mutateAsync(contactForm);
    setShowContactDialog(false);
    setContactForm({ first_name: '', last_name: '', email: '', phone: '', job_title: '', account_id: '' });
  };

  const handleCreateDeal = async () => {
    await createDeal.mutateAsync({ ...dealForm, amount: Number(dealForm.amount) });
    setShowDealDialog(false);
    setDealForm({ name: '', amount: 0, stage: 'qualification', account_id: '', expected_close_date: '' });
  };

  const handleCreateActivity = async () => {
    await createActivity.mutateAsync(activityForm);
    setShowActivityDialog(false);
    setActivityForm({ subject: '', activity_type: 'call', description: '', account_id: '', due_date: '' });
  };

  const filteredAccounts = accounts.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contact filter logic
  const handleContactFilterChange = (key: keyof ContactFiltersState, value: string) => {
    setContactFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearContactFilters = () => {
    setContactFilters(initialContactFilters);
  };

  const activeContactFilterCount = useMemo(() => {
    return Object.values(contactFilters).filter(v => v !== 'all').length;
  }, [contactFilters]);

  // Contact multi-select handlers
  const handleSelectAllContacts = (checked: boolean) => {
    if (checked) {
      setSelectedContactIds(contacts.filter(c => {
        const matchesSearch = 
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      }).map(c => c.id));
    } else {
      setSelectedContactIds([]);
    }
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContactIds(prev => [...prev, contactId]);
    } else {
      setSelectedContactIds(prev => prev.filter(id => id !== contactId));
    }
  };

  const clearContactSelection = () => {
    setSelectedContactIds([]);
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      // Search filter
      const matchesSearch = 
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // Status filter
      if (contactFilters.status !== 'all' && c.status !== contactFilters.status) return false;

      // Lead source filter
      if (contactFilters.leadSource !== 'all' && c.lead_source !== contactFilters.leadSource) return false;

      // Industry filter (from custom_fields)
      if (contactFilters.industry !== 'all') {
        const industry = (c.custom_fields as any)?.industry || (c.custom_fields as any)?.industry_override;
        if (industry !== contactFilters.industry) return false;
      }

      // Priority filter (from custom_fields)
      if (contactFilters.priority !== 'all') {
        const priority = (c.custom_fields as any)?.priority;
        if (priority !== contactFilters.priority) return false;
      }

      // Interaction type filter (from custom_fields)
      if (contactFilters.interactionType !== 'all') {
        const interactionType = (c.custom_fields as any)?.interaction_type;
        if (interactionType !== contactFilters.interactionType) return false;
      }

      // Account type filter (from custom_fields)
      if (contactFilters.accountType !== 'all') {
        const accountType = (c.custom_fields as any)?.account_type;
        if (accountType !== contactFilters.accountType) return false;
      }

      // Has email filter
      if (contactFilters.hasEmail === 'yes' && !c.email) return false;
      if (contactFilters.hasEmail === 'no' && c.email) return false;

      // Has phone filter
      if (contactFilters.hasPhone === 'yes' && !c.phone) return false;
      if (contactFilters.hasPhone === 'no' && c.phone) return false;

      // Tags filter
      if (contactFilters.tags !== 'all') {
        const tags = c.tags || [];
        if (!tags.includes(contactFilters.tags)) return false;
      }

      return true;
    });
  }, [contacts, searchTerm, contactFilters]);

  const allContactsSelected = filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length;
  const someContactsSelected = selectedContactIds.length > 0 && selectedContactIds.length < filteredContacts.length;

  const filteredDeals = deals.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAccountTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      free: 'secondary',
      customer: 'default',
      demo: 'outline',
      var: 'outline',
      customer_service: 'outline',
      admin: 'destructive'
    };
    const labels: Record<string, string> = {
      free: 'Free',
      customer: 'Customer',
      demo: 'Demo',
      var: 'VAR',
      customer_service: 'Customer Service',
      admin: 'Admin'
    };
    return <Badge variant={variants[type] || 'secondary'}>{labels[type] || type}</Badge>;
  };

  const getDealStageBadge = (stage: string) => {
    const colors: Record<string, string> = {
      qualification: 'bg-gray-500',
      discovery: 'bg-blue-500',
      proposal: 'bg-yellow-500',
      negotiation: 'bg-orange-500',
      closed_won: 'bg-green-500',
      closed_lost: 'bg-red-500'
    };
    return (
      <Badge className={`${colors[stage]} text-white`}>
        {stage.replace('_', ' ')}
      </Badge>
    );
  };

  const getActivityTypeBadge = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      call: <Phone className="h-3 w-3" />,
      email: <Mail className="h-3 w-3" />,
      meeting: <Users className="h-3 w-3" />,
      task: <CheckCircle2 className="h-3 w-3" />,
      note: <Activity className="h-3 w-3" />,
      demo: <Globe className="h-3 w-3" />,
      follow_up: <Calendar className="h-3 w-3" />
    };
    return (
      <Badge variant="outline" className="gap-1">
        {icons[type]}
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">CRM</h1>
              <p className="text-muted-foreground">Manage customers, contacts, deals and activities</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAccounts || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.activeAccounts || 0} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalContacts || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats?.pipelineValue || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats?.totalDeals || 0} deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats?.closedWonValue || 0).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="accounts" className="gap-2">
                <Building2 className="h-4 w-4" />
                Accounts
              </TabsTrigger>
              <TabsTrigger value="contacts" className="gap-2">
                <Users className="h-4 w-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="deals" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Deals
              </TabsTrigger>
              <TabsTrigger value="activities" className="gap-2">
                <Activity className="h-4 w-4" />
                Activities
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {activeTab === 'contacts' && (
                <>
                  <CreateAccountsFromContacts />
                  <BulkContactImportDialog accounts={accounts.map(a => ({ id: a.id, name: a.name }))} />
                </>
              )}
              <Button onClick={() => {
                if (activeTab === 'accounts') setShowAccountDialog(true);
                else if (activeTab === 'contacts') setShowContactDialog(true);
                else if (activeTab === 'deals') setShowDealDialog(true);
                else if (activeTab === 'activities') setShowActivityDialog(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab.slice(0, -1)}
              </Button>
            </div>
          </div>

          {/* Accounts Tab */}
          <TabsContent value="accounts">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{getAccountTypeBadge(account.account_type)}</TableCell>
                        <TableCell>{account.industry || '-'}</TableCell>
                        <TableCell>{account.email || '-'}</TableCell>
                        <TableCell>{account.phone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewAccount(account)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteAccount.mutate(account.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No accounts found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="space-y-4">
              <ContactFilters
                filters={contactFilters}
                onFilterChange={handleContactFilterChange}
                onClearFilters={clearContactFilters}
                activeFilterCount={activeContactFilterCount}
              />
              
              {/* Bulk Actions Bar */}
              <ContactBulkActions
                selectedIds={selectedContactIds}
                accounts={accounts.map(a => ({ id: a.id, name: a.name }))}
                contacts={contacts}
                onClearSelection={clearContactSelection}
                onDelete={(ids) => ids.forEach(id => deleteContact.mutate(id))}
              />

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={allContactsSelected}
                            onCheckedChange={handleSelectAllContacts}
                            aria-label="Select all contacts"
                            className={someContactsSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Lead Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((contact) => (
                        <TableRow 
                          key={contact.id}
                          className={selectedContactIds.includes(contact.id) ? 'bg-primary/5' : ''}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedContactIds.includes(contact.id)}
                              onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                              aria-label={`Select ${contact.first_name} ${contact.last_name}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {contact.first_name} {contact.last_name}
                            {contact.is_primary && <Badge variant="outline" className="ml-2">Primary</Badge>}
                          </TableCell>
                          <TableCell>{contact.account?.name || '-'}</TableCell>
                          <TableCell>{contact.job_title || '-'}</TableCell>
                          <TableCell>{contact.email || '-'}</TableCell>
                          <TableCell>{contact.phone || '-'}</TableCell>
                          <TableCell>
                            {contact.lead_source ? (
                              <Badge variant="outline" className="text-xs">
                                {contact.lead_source}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                              {contact.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => deleteContact.mutate(contact.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredContacts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No contacts found {activeContactFilterCount > 0 && '(try adjusting filters)'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal Name</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Close Date</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell className="font-medium">{deal.name}</TableCell>
                        <TableCell>{deal.account?.name || '-'}</TableCell>
                        <TableCell>${deal.amount.toLocaleString()}</TableCell>
                        <TableCell>{getDealStageBadge(deal.stage)}</TableCell>
                        <TableCell>
                          {deal.expected_close_date 
                            ? format(new Date(deal.expected_close_date), 'MMM d, yyyy')
                            : '-'
                          }
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
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteDeal.mutate(deal.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredDeals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No deals found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.subject}</TableCell>
                        <TableCell>{getActivityTypeBadge(activity.activity_type)}</TableCell>
                        <TableCell>{activity.account?.name || '-'}</TableCell>
                        <TableCell>
                          {activity.due_date 
                            ? format(new Date(activity.due_date), 'MMM d, yyyy')
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            activity.status === 'completed' ? 'default' : 
                            activity.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteActivity.mutate(activity.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {activities.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No activities found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Account Dialog */}
        <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>Create a new company or organization record</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input id="name" value={accountForm.name} onChange={(e) => setAccountForm({...accountForm, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" value={accountForm.industry} onChange={(e) => setAccountForm({...accountForm, industry: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select value={accountForm.account_type} onValueChange={(v: any) => setAccountForm({...accountForm, account_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="var">VAR</SelectItem>
                      <SelectItem value="customer_service">Customer Service</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={accountForm.email} onChange={(e) => setAccountForm({...accountForm, email: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={accountForm.phone} onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={accountForm.website} onChange={(e) => setAccountForm({...accountForm, website: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAccountDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateAccount} disabled={!accountForm.name}>Create Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Contact Dialog */}
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>Create a new contact record</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input id="first_name" value={contactForm.first_name} onChange={(e) => setContactForm({...contactForm, first_name: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input id="last_name" value={contactForm.last_name} onChange={(e) => setContactForm({...contactForm, last_name: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact_account">Account</Label>
                <Select value={contactForm.account_id} onValueChange={(v) => setContactForm({...contactForm, account_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input id="job_title" value={contactForm.job_title} onChange={(e) => setContactForm({...contactForm, job_title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <Input id="contact_email" type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input id="contact_phone" value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowContactDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateContact} disabled={!contactForm.first_name || !contactForm.last_name}>Create Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Deal Dialog */}
        <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
              <DialogDescription>Create a new sales opportunity</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="deal_name">Deal Name *</Label>
                <Input id="deal_name" value={dealForm.name} onChange={(e) => setDealForm({...dealForm, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deal_account">Account</Label>
                <Select value={dealForm.account_id} onValueChange={(v) => setDealForm({...dealForm, account_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input id="amount" type="number" value={dealForm.amount} onChange={(e) => setDealForm({...dealForm, amount: Number(e.target.value)})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={dealForm.stage} onValueChange={(v: any) => setDealForm({...dealForm, stage: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qualification">Qualification</SelectItem>
                      <SelectItem value="discovery">Discovery</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed_won">Closed Won</SelectItem>
                      <SelectItem value="closed_lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="close_date">Expected Close Date</Label>
                <Input id="close_date" type="date" value={dealForm.expected_close_date} onChange={(e) => setDealForm({...dealForm, expected_close_date: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDealDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateDeal} disabled={!dealForm.name}>Create Deal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Activity Dialog */}
        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
              <DialogDescription>Log a call, meeting, or task</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" value={activityForm.subject} onChange={(e) => setActivityForm({...activityForm, subject: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="activity_type">Type</Label>
                  <Select value={activityForm.activity_type} onValueChange={(v: any) => setActivityForm({...activityForm, activity_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activity_account">Account</Label>
                  <Select value={activityForm.account_id} onValueChange={(v) => setActivityForm({...activityForm, account_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input id="due_date" type="datetime-local" value={activityForm.due_date} onChange={(e) => setActivityForm({...activityForm, due_date: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={activityForm.description} onChange={(e) => setActivityForm({...activityForm, description: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowActivityDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateActivity} disabled={!activityForm.subject}>Create Activity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Account Detail Dialog */}
        <AccountDetailDialog
          account={selectedAccount}
          open={showAccountDetail}
          onOpenChange={setShowAccountDetail}
        />

        {/* Contact Detail Dialog */}
        <ContactDetailDialog
          contact={selectedContact}
          accounts={accounts.map(a => ({ id: a.id, name: a.name }))}
          open={showContactDetail}
          onOpenChange={setShowContactDetail}
        />
      </div>
    </AdminLayout>
  );
};

export default CRMAdminPage;
