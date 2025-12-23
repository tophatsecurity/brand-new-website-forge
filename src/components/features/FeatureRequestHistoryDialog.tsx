import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { STATUS_OPTIONS } from '@/hooks/useFeatureRequests';
import { History, ArrowRight } from 'lucide-react';

interface HistoryEntry {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_by_email: string | null;
  notes: string | null;
  created_at: string;
}

interface FeatureRequestHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureId: string;
  featureTitle: string;
}

const FeatureRequestHistoryDialog: React.FC<FeatureRequestHistoryDialogProps> = ({
  open,
  onOpenChange,
  featureId,
  featureTitle,
}) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['feature-request-history', featureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_request_history')
        .select('*')
        .eq('feature_id', featureId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as HistoryEntry[];
    },
    enabled: open,
  });

  const getStatusBadge = (status: string | null) => {
    if (!status) return <span className="text-muted-foreground italic">Created</span>;
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return (
      <Badge className={statusOption?.color || ''} variant="secondary">
        {statusOption?.label || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Status History
          </DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">{featureTitle}</p>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading history...
            </div>
          ) : !history?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No history available
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              
              <div className="space-y-4">
                {history.map((entry, index) => (
                  <div key={entry.id} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-background flex items-center justify-center ${
                      index === 0 ? 'bg-primary' : 'bg-muted'
                    }`}>
                      <div className={`h-2 w-2 rounded-full ${
                        index === 0 ? 'bg-primary-foreground' : 'bg-muted-foreground'
                      }`} />
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 border">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {getStatusBadge(entry.old_status)}
                        {entry.old_status && (
                          <>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            {getStatusBadge(entry.new_status)}
                          </>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry.created_at)}
                      </p>
                      
                      {entry.notes && (
                        <p className="text-sm mt-2 text-foreground/80">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureRequestHistoryDialog;
