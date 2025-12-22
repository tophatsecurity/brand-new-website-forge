import React, { useState, useEffect } from 'react';
import { useSupportTickets, SupportTicket, TicketComment, TicketStatus, TicketPriority, ModerationStatus, CommentModerationStatus } from '@/hooks/useSupportTickets';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  Clock,
  MessageSquare,
  Send,
  Loader2,
  Building2,
  Mail,
  Phone,
  Tag,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
  Flag,
  ShieldAlert,
  ShieldCheck,
  ArrowUpCircle,
  XCircle,
  Shield,
} from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

interface TicketDetailDialogProps {
  ticket: SupportTicket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

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

interface AuditLogEntry {
  id: string;
  action: string;
  old_values: any;
  new_values: any;
  user_email: string | null;
  created_at: string;
}

interface ContactInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  account?: {
    id: string;
    name: string;
  };
}

const TicketDetailDialog: React.FC<TicketDetailDialogProps> = ({
  ticket,
  open,
  onOpenChange,
  onUpdate,
}) => {
  const { user } = useAuth();
  const { updateTicket, fetchComments, addComment, flagTicket, moderateTicket, escalateTicket, moderateComment } = useSupportTickets();
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [updating, setUpdating] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loadingContact, setLoadingContact] = useState(false);
  // Moderation state
  const [flagReason, setFlagReason] = useState('');
  const [moderationNotes, setModerationNotes] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [moderating, setModerating] = useState(false);

  useEffect(() => {
    if (open && ticket.id) {
      loadComments();
      loadAuditLog();
      if (ticket.contact_id) {
        loadContactInfo();
      }
    }
  }, [open, ticket.id, ticket.contact_id]);

  const loadComments = async () => {
    const data = await fetchComments(ticket.id);
    setComments(data);
  };

  const loadAuditLog = async () => {
    try {
      const { data } = await supabase
        .from('audit_log')
        .select('*')
        .eq('entity_type', 'support_ticket')
        .eq('entity_id', ticket.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      setAuditLog((data as AuditLogEntry[]) || []);
    } catch (err) {
      console.error('Error loading audit log:', err);
    }
  };

  const loadContactInfo = async () => {
    if (!ticket.contact_id) return;
    
    setLoadingContact(true);
    try {
      const { data } = await supabase
        .from('crm_contacts')
        .select(`
          id, first_name, last_name, email, phone, job_title,
          crm_accounts:account_id (id, name)
        `)
        .eq('id', ticket.contact_id)
        .single();
      
      if (data) {
        setContactInfo({
          ...data,
          account: Array.isArray(data.crm_accounts) ? data.crm_accounts[0] : data.crm_accounts,
        } as ContactInfo);
      }
    } catch (err) {
      console.error('Error loading contact:', err);
    } finally {
      setLoadingContact(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    
    setSending(true);
    const result = await addComment(ticket.id, newComment, isInternal);
    setSending(false);
    
    if (result) {
      setNewComment('');
      loadComments();
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    setStatus(newStatus);
    setUpdating(true);
    await updateTicket(ticket.id, { status: newStatus });
    setUpdating(false);
    onUpdate();
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    setPriority(newPriority);
    setUpdating(true);
    await updateTicket(ticket.id, { priority: newPriority });
    setUpdating(false);
    onUpdate();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full overflow-hidden flex flex-col">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <code className="text-xs font-mono text-muted-foreground">{ticket.ticket_number}</code>
              <SheetTitle className="text-xl mt-1">{ticket.subject}</SheetTitle>
            </div>
            <div className="flex gap-2">
              <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
              <Badge className={priorityColors[priority]}>{priority}</Badge>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="conversation" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="conversation">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversation
            </TabsTrigger>
            <TabsTrigger value="details">
              <FileText className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="contact">
              <User className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="moderation">
              <Shield className="h-4 w-4 mr-2" />
              Moderation
              {(ticket.flagged_for_review || ticket.escalated) && (
                <Badge variant="destructive" className="ml-1 h-5 px-1">!</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Conversation Tab */}
          <TabsContent value="conversation" className="flex-1 flex flex-col overflow-hidden mt-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {/* Original ticket description */}
                <Card>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{ticket.requester_name || ticket.requester_email}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(ticket.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="whitespace-pre-wrap">{ticket.description}</p>
                  </CardContent>
                </Card>

                {/* Comments */}
                {comments.map((comment) => (
                  <Card key={comment.id} className={comment.is_internal ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800' : ''}>
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{comment.user_email || 'Unknown'}</span>
                          {comment.is_internal && (
                            <Badge variant="outline" className="text-xs">Internal Note</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(comment.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="whitespace-pre-wrap">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {/* Reply box */}
            <div className="mt-4 space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label>Reply</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="internal"
                    checked={isInternal}
                    onCheckedChange={setIsInternal}
                  />
                  <Label htmlFor="internal" className="text-sm font-normal">
                    Internal note
                  </Label>
                </div>
              </div>
              <Textarea
                placeholder={isInternal ? "Add an internal note..." : "Type your reply..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handleSendComment} disabled={sending || !newComment.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  {isInternal ? 'Add Note' : 'Send Reply'}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="flex-1 overflow-auto mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => handleStatusChange(v as TicketStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="waiting_customer">Waiting on Customer</SelectItem>
                      <SelectItem value="waiting_internal">Waiting Internal</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v) => handlePriorityChange(v as TicketPriority)}>
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
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="capitalize">{ticket.category || 'General'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(parseISO(ticket.created_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formatDistanceToNow(parseISO(ticket.updated_at), { addSuffix: true })}</span>
                </div>
                {ticket.first_response_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground">First Response:</span>
                    <span>{format(parseISO(ticket.first_response_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                )}
                {ticket.resolved_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground">Resolved:</span>
                    <span>{format(parseISO(ticket.resolved_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                )}
              </div>

              {ticket.resolution && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Resolution</Label>
                    <p className="text-sm bg-muted p-3 rounded-md">{ticket.resolution}</p>
                  </div>
                </>
              )}

              {ticket.tags && ticket.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {ticket.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="flex-1 overflow-auto mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Requester
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{ticket.requester_name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${ticket.requester_email}`} className="text-primary hover:underline">
                      {ticket.requester_email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {contactInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Linked Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{contactInfo.first_name} {contactInfo.last_name}</span>
                      {contactInfo.job_title && (
                        <span className="text-muted-foreground">• {contactInfo.job_title}</span>
                      )}
                    </div>
                    {contactInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                          {contactInfo.email}
                        </a>
                      </div>
                    )}
                    {contactInfo.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{contactInfo.phone}</span>
                      </div>
                    )}
                    {contactInfo.account && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{contactInfo.account.name}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {!contactInfo && !loadingContact && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2" />
                  <p>No linked CRM contact</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="flex-1 overflow-auto mt-4">
            <div className="space-y-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Moderation Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={ticket.moderation_status === 'approved' ? 'default' : ticket.moderation_status === 'rejected' || ticket.moderation_status === 'spam' ? 'destructive' : 'secondary'}>
                      {ticket.moderation_status || 'None'}
                    </Badge>
                  </div>
                  {ticket.flagged_for_review && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                      <Flag className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Flagged for Review</p>
                        {ticket.flag_reason && <p className="text-xs text-yellow-700 dark:text-yellow-500">{ticket.flag_reason}</p>}
                      </div>
                    </div>
                  )}
                  {ticket.escalated && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                      <ArrowUpCircle className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-400">Escalated</p>
                        {ticket.escalation_reason && <p className="text-xs text-red-700 dark:text-red-500">{ticket.escalation_reason}</p>}
                      </div>
                    </div>
                  )}
                  {ticket.moderation_notes && (
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Moderation Notes:</p>
                      <p className="text-sm">{ticket.moderation_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        setModerating(true);
                        await moderateTicket(ticket.id, 'approved');
                        setModerating(false);
                        onUpdate();
                      }}
                      disabled={moderating}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        setModerating(true);
                        await moderateTicket(ticket.id, 'rejected');
                        setModerating(false);
                        onUpdate();
                      }}
                      disabled={moderating}
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        setModerating(true);
                        await moderateTicket(ticket.id, 'spam');
                        setModerating(false);
                        onUpdate();
                      }}
                      disabled={moderating}
                    >
                      <ShieldAlert className="h-4 w-4 mr-2 text-orange-600" />
                      Mark Spam
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        setModerating(true);
                        await moderateTicket(ticket.id, 'under_review');
                        setModerating(false);
                        onUpdate();
                      }}
                      disabled={moderating}
                    >
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      Under Review
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Flag Ticket */}
              {!ticket.flagged_for_review && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      Flag for Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Reason for flagging..."
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value)}
                      rows={2}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        if (!flagReason.trim()) return;
                        setModerating(true);
                        await flagTicket(ticket.id, flagReason);
                        setFlagReason('');
                        setModerating(false);
                        onUpdate();
                      }}
                      disabled={moderating || !flagReason.trim()}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Flag Ticket
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Escalate Ticket */}
              {!ticket.escalated && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ArrowUpCircle className="h-4 w-4" />
                      Escalate Ticket
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Reason for escalation..."
                      value={escalationReason}
                      onChange={(e) => setEscalationReason(e.target.value)}
                      rows={2}
                    />
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={async () => {
                        if (!escalationReason.trim()) return;
                        setModerating(true);
                        await escalateTicket(ticket.id, null, escalationReason);
                        setEscalationReason('');
                        setModerating(false);
                        onUpdate();
                      }}
                      disabled={moderating || !escalationReason.trim()}
                    >
                      <ArrowUpCircle className="h-4 w-4 mr-2" />
                      Escalate to Management
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 overflow-auto mt-4">
            <ScrollArea className="h-full">
              {auditLog.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2" />
                  <p>No activity history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLog.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize font-medium">{entry.action}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(entry.created_at), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          by {entry.user_email || 'System'}
                        </p>
                        {entry.action === 'update' && entry.old_values && entry.new_values && (
                          <div className="mt-2 text-xs space-y-1">
                            {Object.keys(entry.new_values).filter(key => 
                              entry.old_values[key] !== entry.new_values[key]
                            ).map(key => (
                              <div key={key} className="flex gap-2">
                                <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="text-red-500 line-through">{String(entry.old_values[key] || 'none')}</span>
                                <span>→</span>
                                <span className="text-green-600">{String(entry.new_values[key] || 'none')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default TicketDetailDialog;
