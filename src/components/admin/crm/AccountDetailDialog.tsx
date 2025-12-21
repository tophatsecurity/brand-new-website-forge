import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Key, 
  ClipboardList, 
  Users, 
  DollarSign,
  Plus,
  Unlink,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  History
} from 'lucide-react';
import { useCRMAccountDetails, useUnlinkedLicenses, useUnlinkedOnboarding, CRMAccount } from '@/hooks/useCRM';
import { useCRMContacts, useCRMDeals } from '@/hooks/useCRM';
import { format } from 'date-fns';
import AccountTimeline from './AccountTimeline';

interface AccountDetailDialogProps {
  account: CRMAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountDetailDialog = ({ account, open, onOpenChange }: AccountDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showLinkLicenseDialog, setShowLinkLicenseDialog] = useState(false);
  const [showLinkOnboardingDialog, setShowLinkOnboardingDialog] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>('');
  const [selectedOnboardingId, setSelectedOnboardingId] = useState<string>('');

  const { data: accountDetails, linkLicense, unlinkLicense, linkOnboarding, unlinkOnboarding } = useCRMAccountDetails(account?.id || null);
  const { data: contacts = [] } = useCRMContacts(account?.id);
  const { data: deals = [] } = useCRMDeals(account?.id);
  const { data: unlinkedLicenses = [] } = useUnlinkedLicenses();
  const { data: unlinkedOnboarding = [] } = useUnlinkedOnboarding();

  const handleLinkLicense = () => {
    if (selectedLicenseId && account?.id) {
      linkLicense.mutate({ licenseId: selectedLicenseId, accountId: account.id });
      setShowLinkLicenseDialog(false);
      setSelectedLicenseId('');
    }
  };

  const handleLinkOnboarding = () => {
    if (selectedOnboardingId && account?.id) {
      linkOnboarding.mutate({ onboardingId: selectedOnboardingId, accountId: account.id });
      setShowLinkOnboardingDialog(false);
      setSelectedOnboardingId('');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
      expired: 'destructive',
      pending: 'outline',
      completed: 'default',
      in_progress: 'secondary',
      not_started: 'outline',
      on_hold: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const getOnboardingProgress = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{current}/{total}</span>
      </div>
    );
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {account.name}
            <Badge variant={account.status === 'active' ? 'default' : 'secondary'} className="ml-2">
              {account.status}
            </Badge>
            <Badge variant="outline">{account.account_type}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="gap-1">
              <Building2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1">
              <History className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="licenses" className="gap-1">
              <Key className="h-4 w-4" />
              Licenses
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="gap-1">
              <ClipboardList className="h-4 w-4" />
              Onboarding
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="deals" className="gap-1">
              <DollarSign className="h-4 w-4" />
              Deals
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {account.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{account.email}</span>
                    </div>
                  )}
                  {account.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{account.phone}</span>
                    </div>
                  )}
                  {account.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {account.website}
                      </a>
                    </div>
                  )}
                  {(account.city || account.state || account.country) && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{[account.city, account.state, account.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{accountDetails?.licenses?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Licenses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{accountDetails?.onboarding?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Onboarding</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{contacts.length}</div>
                      <div className="text-xs text-muted-foreground">Contacts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{deals.length}</div>
                      <div className="text-xs text-muted-foreground">Deals</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {account.notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{account.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <h3 className="text-lg font-medium">Activity Timeline</h3>
            <AccountTimeline accountId={account.id} />
          </TabsContent>

          {/* Licenses Tab */}
          <TabsContent value="licenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Linked Licenses</h3>
              <Button size="sm" onClick={() => setShowLinkLicenseDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Link License
              </Button>
            </div>

            {showLinkLicenseDialog && (
              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Select value={selectedLicenseId} onValueChange={setSelectedLicenseId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select an unlinked license..." />
                      </SelectTrigger>
                      <SelectContent>
                        {unlinkedLicenses.map((license) => (
                          <SelectItem key={license.id} value={license.id}>
                            {license.product_name} - {license.license_key.substring(0, 12)}...
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleLinkLicense} disabled={!selectedLicenseId}>Link</Button>
                    <Button variant="outline" onClick={() => setShowLinkLicenseDialog(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {accountDetails?.licenses && accountDetails.licenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>License Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountDetails.licenses.map((license) => (
                    <TableRow key={license.id}>
                      <TableCell className="font-medium">{license.product_name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {license.license_key.substring(0, 16)}...
                      </TableCell>
                      <TableCell>{getStatusBadge(license.status)}</TableCell>
                      <TableCell>{license.seats}</TableCell>
                      <TableCell>
                        {format(new Date(license.expiry_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => unlinkLicense.mutate(license.id)}
                          title="Unlink license"
                        >
                          <Unlink className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Key className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No licenses linked to this account</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Linked Onboarding Records</h3>
              <Button size="sm" onClick={() => setShowLinkOnboardingDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Link Onboarding
              </Button>
            </div>

            {showLinkOnboardingDialog && (
              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Select value={selectedOnboardingId} onValueChange={setSelectedOnboardingId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select an unlinked onboarding record..." />
                      </SelectTrigger>
                      <SelectContent>
                        {unlinkedOnboarding.map((ob) => (
                          <SelectItem key={ob.id} value={ob.id}>
                            {ob.contact_name || ob.contact_email} - {ob.status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleLinkOnboarding} disabled={!selectedOnboardingId}>Link</Button>
                    <Button variant="outline" onClick={() => setShowLinkOnboardingDialog(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {accountDetails?.onboarding && accountDetails.onboarding.length > 0 ? (
              <div className="space-y-4">
                {accountDetails.onboarding.map((ob) => (
                  <Card key={ob.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          {ob.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {ob.status === 'in_progress' && <Clock className="h-4 w-4 text-yellow-500" />}
                          {ob.status === 'on_hold' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {ob.contact_name || 'Onboarding'}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ob.status)}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => unlinkOnboarding.mutate(ob.id)}
                            title="Unlink onboarding"
                          >
                            <Unlink className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>{ob.contact_email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span>Step {ob.current_step} of {ob.total_steps}</span>
                        </div>
                        {getOnboardingProgress(ob.current_step, ob.total_steps)}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          {ob.started_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Started: {format(new Date(ob.started_at), 'MMM d, yyyy')}
                            </span>
                          )}
                          {ob.completed_at && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed: {format(new Date(ob.completed_at), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No onboarding records linked to this account</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            <h3 className="text-lg font-medium">Account Contacts</h3>
            {contacts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.first_name} {contact.last_name}
                        {contact.is_primary && <Badge variant="outline" className="ml-2">Primary</Badge>}
                      </TableCell>
                      <TableCell>{contact.job_title || '-'}</TableCell>
                      <TableCell>{contact.email || '-'}</TableCell>
                      <TableCell>{contact.phone || '-'}</TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No contacts linked to this account</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals" className="space-y-4">
            <h3 className="text-lg font-medium">Account Deals</h3>
            {deals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Close Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">{deal.name}</TableCell>
                      <TableCell>${deal.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          deal.stage === 'closed_won' ? 'bg-green-500' :
                          deal.stage === 'closed_lost' ? 'bg-red-500' :
                          'bg-blue-500'
                        }>
                          {deal.stage.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{deal.probability}%</TableCell>
                      <TableCell>
                        {deal.expected_close_date 
                          ? format(new Date(deal.expected_close_date), 'MMM d, yyyy')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No deals linked to this account</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailDialog;
