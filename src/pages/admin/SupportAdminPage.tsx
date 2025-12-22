import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupportTickets, SupportTicket, TicketStatus, TicketPriority } from '@/hooks/useSupportTickets';
import { useSupportTeam, TeamMember } from '@/hooks/useSupportTeam';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Ticket,
  Search,
  Plus,
  Clock,
  User,
  Loader2,
  ChevronRight,
  Flag,
  HeadphonesIcon,
  FileText,
  ShieldCheck,
  Users,
  MessageSquare,
} from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import TicketDetailDialog from '@/components/admin/support/TicketDetailDialog';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

// Types for support documents
type SupportDoc = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
};

const priorityColors: Record<TicketPriority, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const statusColors: Record<TicketStatus, string> = {
  open: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  waiting_customer: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  waiting_internal: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  resolved: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const statusLabels: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  waiting_customer: 'Waiting on Customer',
  waiting_internal: 'Waiting Internal',
  resolved: 'Resolved',
  closed: 'Closed',
};

const SupportAdminPage = () => {
  const { user } = useAuth();
  const { tickets, loading: ticketsLoading, createTicket, fetchTickets } = useSupportTickets();
  const [mainTab, setMainTab] = useState('tickets');
  const { data: teamMembers = [], isLoading: teamLoading } = useSupportTeam();
  const [ticketTab, setTicketTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as TicketPriority,
    category: 'general',
  });

  // Knowledge base state
  const [docs, setDocs] = useState<SupportDoc[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docSearch, setDocSearch] = useState('');

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setDocsLoading(true);
    const { data, error } = await supabase
      .from('support_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setDocs(data);
    setDocsLoading(false);
  };

  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requester_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    let matchesTab = true;
    if (ticketTab === 'open') matchesTab = ['open', 'in_progress'].includes(ticket.status);
    if (ticketTab === 'waiting') matchesTab = ['waiting_customer', 'waiting_internal'].includes(ticket.status);
    if (ticketTab === 'resolved') matchesTab = ['resolved', 'closed'].includes(ticket.status);
    if (ticketTab === 'urgent') matchesTab = ticket.priority === 'urgent';
    if (ticketTab === 'flagged') matchesTab = ticket.flagged_for_review || ticket.escalated;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  const filteredDocs = docs.filter(d =>
    d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.content.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.tags.some(t => t.toLowerCase().includes(docSearch.toLowerCase()))
  );

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    waiting: tickets.filter(t => ['waiting_customer', 'waiting_internal'].includes(t.status)).length,
    urgent: tickets.filter(t => t.priority === 'urgent' && !['resolved', 'closed'].includes(t.status)).length,
    flagged: tickets.filter(t => t.flagged_for_review || t.escalated).length,
    teamMembers: teamMembers.length,
    articles: docs.length,
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) return;
    
    setCreating(true);
    const result = await createTicket(newTicket);
    setCreating(false);
    
    if (result) {
      setShowCreateDialog(false);
      setNewTicket({ subject: '', description: '', priority: 'medium', category: 'general' });
    }
  };

  return (
    <AdminLayout title="Support Center">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Waiting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Urgent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Flag className="h-4 w-4" />
                Flagged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.flagged}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamMembers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.articles}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={mainTab} onValueChange={setMainTab}>
          <TabsList>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Moderation
              {stats.flagged > 0 && <Badge variant="destructive" className="ml-1">{stats.flagged}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <HeadphonesIcon className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TicketStatus | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="waiting_customer">Waiting Customer</SelectItem>
                    <SelectItem value="waiting_internal">Waiting Internal</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as TicketPriority | 'all')}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>

            <Tabs value={ticketTab} onValueChange={setTicketTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">
                  Open
                  {stats.open > 0 && <Badge variant="secondary" className="ml-2">{stats.open}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="waiting">
                  Waiting
                  {stats.waiting > 0 && <Badge variant="secondary" className="ml-2">{stats.waiting}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="urgent">
                  Urgent
                  {stats.urgent > 0 && <Badge variant="destructive" className="ml-2">{stats.urgent}</Badge>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={ticketTab} className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    {ticketsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredTickets.length === 0 ? (
                      <div className="text-center py-12">
                        <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No tickets found</h3>
                        <p className="text-muted-foreground">No tickets match your current filters.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ticket</TableHead>
                            <TableHead>Requester</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-10"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTickets.map((ticket) => (
                            <TableRow 
                              key={ticket.id} 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              <TableCell>
                                <div>
                                  <code className="text-xs font-mono text-muted-foreground">{ticket.ticket_number}</code>
                                  <p className="font-medium truncate max-w-[250px]">{ticket.subject}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm">{ticket.requester_name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground">{ticket.requester_email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[ticket.status]}>
                                  {statusLabels[ticket.status]}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={priorityColors[ticket.priority]}>
                                  {ticket.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="capitalize">{ticket.category || 'General'}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(parseISO(ticket.created_at), { addSuffix: true })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Moderation Queue
                </CardTitle>
                <CardDescription>
                  Review flagged tickets and comments that need moderation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {tickets.filter(t => t.flagged_for_review || t.escalated).length === 0 ? (
                      <div className="text-center py-12">
                        <ShieldCheck className="h-12 w-12 mx-auto text-green-500 mb-4" />
                        <h3 className="text-lg font-medium">All Clear</h3>
                        <p className="text-muted-foreground">No tickets need moderation at this time.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ticket</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tickets
                            .filter(t => t.flagged_for_review || t.escalated)
                            .map((ticket) => (
                              <TableRow key={ticket.id}>
                                <TableCell>
                                  <div>
                                    <code className="text-xs font-mono text-muted-foreground">{ticket.ticket_number}</code>
                                    <p className="font-medium">{ticket.subject}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {ticket.escalated && (
                                    <Badge variant="destructive" className="mr-1">Escalated</Badge>
                                  )}
                                  {ticket.flagged_for_review && (
                                    <Badge variant="outline" className="border-orange-500 text-orange-600">Flagged</Badge>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {ticket.flag_reason || ticket.escalation_reason || 'No reason specified'}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusColors[ticket.status]}>
                                    {statusLabels[ticket.status]}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={priorityColors[ticket.priority]}>
                                    {ticket.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedTicket(ticket)}
                                  >
                                    Review
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeadphonesIcon className="h-5 w-5" />
                  Support Team
                </CardTitle>
                <CardDescription>
                  Team members with support and customer rep roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teamLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No team members</h3>
                    <p className="text-muted-foreground">Assign the support or customer_rep role to users to add them here.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{member.role}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Knowledge Base
                </CardTitle>
                <CardDescription>
                  Help articles and documentation for customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search articles..."
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                {docsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredDocs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No articles found</h3>
                    <p className="text-muted-foreground">No knowledge base articles match your search.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredDocs.map((doc) => (
                      <Card key={doc.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{doc.category}</Badge>
                            {doc.tags?.map((tag) => (
                              <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3">
                            {doc.content.slice(0, 200)}{doc.content.length > 200 && '...'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Last updated: {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Ticket Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Create a new support ticket on behalf of a customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={newTicket.priority} 
                    onValueChange={(v) => setNewTicket(prev => ({ ...prev, priority: v as TicketPriority }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={newTicket.category} 
                    onValueChange={(v) => setNewTicket(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="licensing">Licensing</SelectItem>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateTicket} disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Ticket Detail Dialog */}
        <TicketDetailDialog
          ticket={selectedTicket!}
          open={!!selectedTicket}
          onOpenChange={(open) => !open && setSelectedTicket(null)}
          onUpdate={fetchTickets}
        />
      </div>
    </AdminLayout>
  );
};

export default SupportAdminPage;
