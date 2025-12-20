import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useOnboardingAdmin, CustomerOnboarding, OnboardingStatus } from '@/hooks/useOnboarding';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Eye, Mail, Search, Filter, Users, CheckCircle, Clock, Pause, Send } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const statusColors: Record<OnboardingStatus, string> = {
  not_started: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
  on_hold: 'bg-yellow-500'
};

const statusIcons: Record<OnboardingStatus, React.ReactNode> = {
  not_started: <Clock className="h-4 w-4" />,
  in_progress: <Clock className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  on_hold: <Pause className="h-4 w-4" />
};

interface OnboardingDetailsProps {
  onboarding: CustomerOnboarding;
  onStatusChange: (status: OnboardingStatus, notes?: string) => Promise<void>;
  onSendEmail: (emailType: string) => Promise<void>;
}

const OnboardingDetails: React.FC<OnboardingDetailsProps> = ({ onboarding, onStatusChange, onSendEmail }) => {
  const [newStatus, setNewStatus] = useState<OnboardingStatus>(onboarding.status);
  const [notes, setNotes] = useState(onboarding.notes || '');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchDetails = async () => {
      const { data: stepsData } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('onboarding_id', onboarding.id)
        .order('step_number', { ascending: true });
      
      const { data: emailsData } = await supabase
        .from('onboarding_emails')
        .select('*')
        .eq('onboarding_id', onboarding.id)
        .order('sent_at', { ascending: false });

      setSteps(stepsData || []);
      setEmails(emailsData || []);
    };
    fetchDetails();
  }, [onboarding.id]);

  const handleSave = async () => {
    setLoading(true);
    await onStatusChange(newStatus, notes);
    setLoading(false);
    toast({ title: 'Onboarding updated successfully' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Company</p>
          <p className="font-medium">{onboarding.company_name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Contact</p>
          <p className="font-medium">{onboarding.contact_name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{onboarding.contact_email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium">{onboarding.contact_phone || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Started</p>
          <p className="font-medium">
            {onboarding.started_at ? format(new Date(onboarding.started_at), 'PPp') : 'Not started'}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="font-medium">{onboarding.current_step} / {onboarding.total_steps} steps</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OnboardingStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this onboarding..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Steps Progress</label>
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm">{step.step_number}. {step.step_name}</span>
              <Badge variant={step.is_completed ? 'default' : 'secondary'}>
                {step.is_completed ? 'Completed' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Send Email</label>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onSendEmail('welcome')}>
            <Send className="h-4 w-4 mr-1" /> Welcome
          </Button>
          <Button size="sm" variant="outline" onClick={() => onSendEmail('reminder')}>
            <Send className="h-4 w-4 mr-1" /> Reminder
          </Button>
          <Button size="sm" variant="outline" onClick={() => onSendEmail('completion')}>
            <Send className="h-4 w-4 mr-1" /> Completion
          </Button>
        </div>
      </div>

      {emails.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Email History</label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {emails.map((email) => (
              <div key={email.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                <span>{email.email_type}: {email.subject}</span>
                <span className="text-muted-foreground">{format(new Date(email.sent_at), 'PP')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleSave} disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

const OnboardingAdminPage: React.FC = () => {
  const { user, isAdmin, activeRole } = useAuth();
  const { onboardings, loading, updateOnboardingStatus, refetch } = useOnboardingAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  // Check access based on role
  const hasAccess = isAdmin || activeRole === 'customer_rep' || activeRole === 'var';
  
  if (!user || !hasAccess) {
    return <Navigate to="/" />;
  }

  const filteredOnboardings = onboardings.filter((o) => {
    const matchesSearch = 
      o.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.contact_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: onboardings.length,
    in_progress: onboardings.filter(o => o.status === 'in_progress').length,
    completed: onboardings.filter(o => o.status === 'completed').length,
    on_hold: onboardings.filter(o => o.status === 'on_hold').length
  };

  const sendOnboardingEmail = async (onboarding: CustomerOnboarding, emailType: string) => {
    try {
      const emailSubjects: Record<string, string> = {
        welcome: 'Welcome to Top Hat Security - Get Started',
        reminder: 'Complete Your Onboarding - Top Hat Security',
        completion: 'Congratulations! Your Onboarding is Complete'
      };

      const { data, error } = await supabase.functions.invoke('send-email-postmark', {
        body: {
          to: onboarding.contact_email,
          subject: emailSubjects[emailType] || 'Top Hat Security Notification',
          htmlBody: `
            <h1>Hello ${onboarding.contact_name || 'Customer'},</h1>
            <p>This is a ${emailType} email from Top Hat Security.</p>
            <p>Your onboarding progress: Step ${onboarding.current_step} of ${onboarding.total_steps}</p>
            <p>Thank you for choosing Top Hat Security!</p>
          `,
          tag: `onboarding-${emailType}`
        }
      });

      if (error) throw error;

      // Log the email
      await supabase.from('onboarding_emails').insert({
        onboarding_id: onboarding.id,
        email_type: emailType,
        recipient_email: onboarding.contact_email,
        subject: emailSubjects[emailType],
        status: 'sent',
        message_id: data?.messageId
      });

      toast({
        title: 'Email sent!',
        description: `${emailType} email sent to ${onboarding.contact_email}`
      });
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: 'Email failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <AdminLayout title="Customer Onboarding">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.in_progress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Pause className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{stats.on_hold}</p>
              <p className="text-sm text-muted-foreground">On Hold</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company, email, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Onboardings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Onboardings</CardTitle>
          <CardDescription>Manage and track customer onboarding progress</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredOnboardings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No onboardings found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOnboardings.map((onboarding) => (
                  <TableRow key={onboarding.id}>
                    <TableCell className="font-medium">
                      {onboarding.company_name || 'N/A'}
                    </TableCell>
                    <TableCell>{onboarding.contact_name || 'N/A'}</TableCell>
                    <TableCell>{onboarding.contact_email}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[onboarding.status]}>
                        <span className="flex items-center gap-1">
                          {statusIcons[onboarding.status]}
                          {onboarding.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {onboarding.current_step}/{onboarding.total_steps}
                    </TableCell>
                    <TableCell>
                      {onboarding.started_at 
                        ? format(new Date(onboarding.started_at), 'PP') 
                        : 'Not started'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Onboarding Details</DialogTitle>
                              <DialogDescription>
                                View and manage customer onboarding
                              </DialogDescription>
                            </DialogHeader>
                            <OnboardingDetails
                              onboarding={onboarding}
                              onStatusChange={async (status, notes) => {
                                await updateOnboardingStatus(onboarding.id, status, notes);
                                refetch();
                              }}
                              onSendEmail={(emailType) => sendOnboardingEmail(onboarding, emailType)}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendOnboardingEmail(onboarding, 'reminder')}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default OnboardingAdminPage;
