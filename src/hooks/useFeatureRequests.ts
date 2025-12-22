import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { generateSluggedUsername } from '@/utils/usernameGenerator';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  product_name: string;
  status: 'pending' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'critical';
  submitted_by: string | null;
  submitted_by_email: string | null;
  assigned_to: string | null;
  vote_count: number;
  created_at: string;
  updated_at: string;
  has_voted?: boolean;
}

export const useFeatureRequests = (productFilter?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const requestsQuery = useQuery({
    queryKey: ['feature-requests', productFilter],
    queryFn: async () => {
      let query = supabase
        .from('feature_requests')
        .select('*')
        .order('vote_count', { ascending: false });

      if (productFilter && productFilter !== 'all') {
        query = query.eq('product_name', productFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Check if user has voted on each request
      if (user && data) {
        const { data: votes } = await supabase
          .from('feature_votes')
          .select('feature_id')
          .eq('user_id', user.id);

        const votedIds = new Set(votes?.map(v => v.feature_id) || []);
        return data.map(req => ({
          ...req,
          has_voted: votedIds.has(req.id)
        })) as FeatureRequest[];
      }

      return data as FeatureRequest[];
    },
  });

  const createRequest = useMutation({
    mutationFn: async (request: { title: string; description: string; product_name: string; anonymousUsername?: string }) => {
      // Use provided anonymous username or generate one
      const displayName = request.anonymousUsername || generateSluggedUsername();
      
      const { data, error } = await supabase
        .from('feature_requests')
        .insert({
          title: request.title,
          description: request.description,
          product_name: request.product_name,
          submitted_by: user?.id,
          submitted_by_email: displayName,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      toast.success('Feature request submitted anonymously');
    },
    onError: (error: any) => {
      toast.error(`Failed to submit request: ${error.message}`);
    },
  });

  // Allow users to retract their own pending requests
  const retractRequest = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Must be logged in to retract');
      
      // Verify ownership and status
      const { data: request } = await supabase
        .from('feature_requests')
        .select('submitted_by, status')
        .eq('id', id)
        .maybeSingle();
      
      if (!request) throw new Error('Request not found');
      if (request.submitted_by !== user.id) throw new Error('You can only retract your own requests');
      if (request.status !== 'pending') throw new Error('Can only retract pending requests');
      
      const { error } = await supabase
        .from('feature_requests')
        .delete()
        .eq('id', id)
        .eq('submitted_by', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      toast.success('Feature request retracted');
    },
    onError: (error: any) => {
      toast.error(`Failed to retract: ${error.message}`);
    },
  });

  // For admins/program managers to create requests on behalf of users
  const createRequestOnBehalf = useMutation({
    mutationFn: async (request: { 
      title: string; 
      description: string; 
      product_name: string;
      priority?: string;
      submitted_by_email?: string;
    }) => {
      const { data, error } = await supabase
        .from('feature_requests')
        .insert({
          title: request.title,
          description: request.description,
          product_name: request.product_name,
          priority: request.priority || 'medium',
          submitted_by_email: request.submitted_by_email || null,
          submitted_by: null, // No user ID since it's on behalf of someone else
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      toast.success('Feature request created on behalf of user');
    },
    onError: (error: any) => {
      toast.error(`Failed to create request: ${error.message}`);
    },
  });

  const updateRequest = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FeatureRequest> & { id: string }) => {
      // Get old request for comparison
      const { data: oldRequest } = await supabase
        .from('feature_requests')
        .select('*')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('feature_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      // Send email notification if status changed
      if (oldRequest && updates.status && oldRequest.status !== updates.status && oldRequest.submitted_by_email) {
        const statusColors: Record<string, string> = {
          pending: '#64748b',
          under_review: '#3b82f6',
          planned: '#8b5cf6',
          in_progress: '#eab308',
          completed: '#22c55e',
          declined: '#ef4444',
        };

        try {
          await supabase.functions.invoke('send-email-postmark', {
            body: {
              to: oldRequest.submitted_by_email,
              subject: `Feature Request Update: ${oldRequest.title}`,
              template: 'feature_request_status',
              data: {
                userName: oldRequest.submitted_by_email.split('@')[0],
                title: oldRequest.title,
                status: updates.status?.replace('_', ' '),
                statusColor: statusColors[updates.status] || '#3b82f6',
                productName: oldRequest.product_name,
                requestUrl: `${window.location.origin}/feature-requests`,
              },
            },
          });
        } catch (emailError) {
          console.error('Failed to send feature request update email:', emailError);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      toast.success('Request updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update request: ${error.message}`);
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('feature_requests').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      toast.success('Request deleted');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete request: ${error.message}`);
    },
  });

  const vote = useMutation({
    mutationFn: async (featureId: string) => {
      if (!user) throw new Error('Must be logged in to vote');
      const { error } = await supabase
        .from('feature_votes')
        .insert({ feature_id: featureId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      toast.success('Vote added');
    },
    onError: (error: any) => {
      if (error.message.includes('duplicate')) {
        toast.error('Already voted');
      } else {
        toast.error(`Failed to vote: ${error.message}`);
      }
    },
  });

  const unvote = useMutation({
    mutationFn: async (featureId: string) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase
        .from('feature_votes')
        .delete()
        .eq('feature_id', featureId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      toast.success('Vote removed');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove vote: ${error.message}`);
    },
  });

  return {
    ...requestsQuery,
    createRequest,
    createRequestOnBehalf,
    updateRequest,
    deleteRequest,
    retractRequest,
    vote,
    unvote,
  };
};

export const PRODUCT_OPTIONS = [
  { value: 'DDX', label: 'DDX' },
  { value: 'SEEKCAP', label: 'SEEKCAP' },
  { value: 'PARAGUARD', label: 'PARAGUARD' },
  { value: 'SECONDLOOK', label: 'SECONDLOOK' },
  { value: 'LIGHTFOOT', label: 'LIGHTFOOT' },
  { value: 'O-RANGE', label: 'O-RANGE' },
  { value: 'ONBOARD', label: 'ONBOARD' },
  { value: 'AURORA SENSE', label: 'AURORA SENSE' },
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-muted text-muted-foreground' },
  { value: 'under_review', label: 'Under Review', color: 'bg-blue-500/10 text-blue-500' },
  { value: 'planned', label: 'Planned', color: 'bg-purple-500/10 text-purple-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500/10 text-yellow-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500/10 text-green-500' },
  { value: 'declined', label: 'Declined', color: 'bg-red-500/10 text-red-500' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];
