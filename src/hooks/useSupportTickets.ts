import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'waiting_internal' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  requester_id: string | null;
  requester_email: string;
  requester_name: string | null;
  account_id: string | null;
  contact_id: string | null;
  assigned_to: string | null;
  assigned_team: string | null;
  product_name: string | null;
  license_id: string | null;
  resolution: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  first_response_at: string | null;
  sla_due_at: string | null;
  tags: string[];
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  user_email: string | null;
  content: string;
  is_internal: boolean;
  is_resolution: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketData {
  subject: string;
  description: string;
  priority?: TicketPriority;
  category?: string;
  product_name?: string;
  tags?: string[];
}

export interface UpdateTicketData {
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assigned_to?: string | null;
  assigned_team?: string | null;
  resolution?: string;
  tags?: string[];
  account_id?: string | null;
  contact_id?: string | null;
}

export const useSupportTickets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTickets((data as SupportTicket[]) || []);
    } catch (err: any) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketById = async (ticketId: string): Promise<SupportTicket | null> => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error) throw error;
      return data as SupportTicket;
    } catch (err: any) {
      console.error('Error fetching ticket:', err);
      return null;
    }
  };

  const createTicket = async (ticketData: CreateTicketData): Promise<SupportTicket | null> => {
    if (!user) return null;

    try {
      const insertData = {
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority || 'medium',
        category: ticketData.category || 'general',
        product_name: ticketData.product_name,
        tags: ticketData.tags || [],
        requester_id: user.id,
        requester_email: user.email || '',
        requester_name: user.user_metadata?.full_name || user.email,
      };

      const { data, error } = await supabase
        .from('support_tickets')
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;

      // Log to audit
      await logAuditEvent('create', 'support_ticket', data.id, null, data);

      // Send email notifications
      try {
        // Send confirmation email to requester
        await supabase.functions.invoke('send-email-postmark', {
          body: {
            to: user.email,
            subject: `Ticket Created: ${data.ticket_number} - ${ticketData.subject}`,
            template: 'ticket_created',
            data: {
              requesterName: user.user_metadata?.full_name || user.email?.split('@')[0],
              ticketNumber: data.ticket_number,
              subject: ticketData.subject,
              description: ticketData.description,
              priority: ticketData.priority || 'medium',
              category: ticketData.category || 'general',
              ticketUrl: `${window.location.origin}/support/tickets`,
            },
          },
        });

        // Send admin notification
        await supabase.functions.invoke('send-email-postmark', {
          body: {
            to: 'support@tophatsecurity.com',
            subject: `[${(ticketData.priority || 'medium').toUpperCase()}] New Ticket: ${data.ticket_number}`,
            template: 'ticket_admin_notification',
            data: {
              ticketNumber: data.ticket_number,
              subject: ticketData.subject,
              description: ticketData.description,
              requesterName: user.user_metadata?.full_name || user.email,
              requesterEmail: user.email,
              priority: ticketData.priority || 'medium',
              priorityColor: getPriorityColor(ticketData.priority || 'medium'),
              category: ticketData.category || 'general',
              productName: ticketData.product_name,
            },
          },
        });
      } catch (emailError) {
        console.error('Failed to send ticket notification emails:', emailError);
        // Don't fail the ticket creation if emails fail
      }

      toast({
        title: 'Ticket created',
        description: `Ticket ${data.ticket_number} has been created.`,
      });

      await fetchTickets();
      return data as SupportTicket;
    } catch (err: any) {
      console.error('Error creating ticket:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to create ticket',
        variant: 'destructive',
      });
      return null;
    }
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: '#64748b',
      medium: '#3b82f6',
      high: '#f97316',
      urgent: '#dc2626',
    };
    return colors[priority] || '#3b82f6';
  };

  const getStatusInfo = (status: string): { label: string; color: string } => {
    const statusMap: Record<string, { label: string; color: string }> = {
      open: { label: 'Open', color: '#eab308' },
      in_progress: { label: 'In Progress', color: '#3b82f6' },
      waiting_customer: { label: 'Waiting on Customer', color: '#8b5cf6' },
      waiting_internal: { label: 'Under Review', color: '#64748b' },
      resolved: { label: 'Resolved', color: '#22c55e' },
      closed: { label: 'Closed', color: '#6b7280' },
    };
    return statusMap[status] || { label: status, color: '#3b82f6' };
  };

  const updateTicket = async (ticketId: string, updates: UpdateTicketData): Promise<boolean> => {
    try {
      // Get old values for audit
      const { data: oldData } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      const updateData: any = { ...updates };
      
      // If resolving, set resolved_at and resolved_by
      if (updates.status === 'resolved' && oldData?.status !== 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = user?.id;
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
        .single();

      if (error) throw error;

      // Log to audit
      await logAuditEvent('update', 'support_ticket', ticketId, oldData, data);

      toast({
        title: 'Ticket updated',
        description: 'Ticket has been updated successfully.',
      });

      await fetchTickets();
      return true;
    } catch (err: any) {
      console.error('Error updating ticket:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update ticket',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteTicket = async (ticketId: string): Promise<boolean> => {
    try {
      const { data: oldData } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketId);

      if (error) throw error;

      await logAuditEvent('delete', 'support_ticket', ticketId, oldData, null);

      toast({
        title: 'Ticket deleted',
        description: 'Ticket has been deleted.',
      });

      await fetchTickets();
      return true;
    } catch (err: any) {
      console.error('Error deleting ticket:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete ticket',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Comments
  const fetchComments = async (ticketId: string): Promise<TicketComment[]> => {
    try {
      const { data, error } = await supabase
        .from('ticket_comments')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data as TicketComment[]) || [];
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      return [];
    }
  };

  const addComment = async (
    ticketId: string,
    content: string,
    isInternal: boolean = false,
    isResolution: boolean = false
  ): Promise<TicketComment | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ticket_comments')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          user_email: user.email,
          content,
          is_internal: isInternal,
          is_resolution: isResolution,
        })
        .select()
        .single();

      if (error) throw error;

      // Get ticket info for notification
      const { data: ticket } = await supabase
        .from('support_tickets')
        .select('ticket_number, subject, requester_id, requester_email, requester_name, first_response_at, status')
        .eq('id', ticketId)
        .single();

      // Update first_response_at if this is the first staff response
      if (ticket && !ticket.first_response_at && ticket.requester_id !== user.id) {
        await supabase
          .from('support_tickets')
          .update({ first_response_at: new Date().toISOString() })
          .eq('id', ticketId);
      }

      await logAuditEvent('create', 'ticket_comment', data.id, null, { ...data, ticket_id: ticketId });

      // Send email notification to requester if this is a non-internal comment from staff
      if (ticket && !isInternal && ticket.requester_id !== user.id && ticket.requester_email) {
        try {
          const statusInfo = getStatusInfo(ticket.status);
          await supabase.functions.invoke('send-email-postmark', {
            body: {
              to: ticket.requester_email,
              subject: `Update on Ticket ${ticket.ticket_number}: ${ticket.subject}`,
              template: 'ticket_updated',
              data: {
                requesterName: ticket.requester_name || ticket.requester_email?.split('@')[0],
                ticketNumber: ticket.ticket_number,
                subject: ticket.subject,
                status: ticket.status,
                statusLabel: statusInfo.label,
                statusColor: statusInfo.color,
                updateType: 'New reply from support team',
                newComment: content,
                resolution: isResolution ? content : null,
                ticketUrl: `${window.location.origin}/support/tickets`,
              },
            },
          });
        } catch (emailError) {
          console.error('Failed to send ticket update notification:', emailError);
        }
      }

      toast({
        title: isInternal ? 'Note added' : 'Reply sent',
        description: isInternal ? 'Internal note has been added.' : 'Your reply has been sent.',
      });

      return data as TicketComment;
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to add comment',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Audit logging helper
  const logAuditEvent = async (
    action: string,
    entityType: string,
    entityId: string,
    oldValues: any,
    newValues: any
  ) => {
    try {
      await supabase.from('audit_log').insert({
        action,
        entity_type: entityType,
        entity_id: entityId,
        old_values: oldValues,
        new_values: newValues,
        user_id: user?.id,
        user_email: user?.email,
      });
    } catch (err) {
      console.error('Error logging audit event:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchComments,
    addComment,
  };
};
