import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Key, 
  ClipboardList, 
  Users, 
  DollarSign,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  XCircle,
  Building2,
  MessageSquare,
  FileText,
  Presentation
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface TimelineEvent {
  id: string;
  type: 'license' | 'onboarding' | 'activity' | 'deal' | 'contact';
  action: string;
  title: string;
  description?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface AccountTimelineProps {
  accountId: string;
}

const AccountTimeline = ({ accountId }: AccountTimelineProps) => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['account-timeline', accountId],
    queryFn: async () => {
      const timelineEvents: TimelineEvent[] = [];

      // Fetch licenses
      const { data: licenses } = await supabase
        .from('product_licenses')
        .select('*')
        .eq('account_id', accountId);

      licenses?.forEach((license) => {
        // License created
        timelineEvents.push({
          id: `license-created-${license.id}`,
          type: 'license',
          action: 'license_created',
          title: `License created: ${license.product_name}`,
          description: `${license.seats} seat(s) - Status: ${license.status}`,
          timestamp: license.created_at,
          metadata: { license }
        });

        // License activated
        if (license.activation_date) {
          timelineEvents.push({
            id: `license-activated-${license.id}`,
            type: 'license',
            action: 'license_activated',
            title: `License activated: ${license.product_name}`,
            description: `Activated for ${license.assigned_to || 'unknown user'}`,
            timestamp: license.activation_date,
            metadata: { license }
          });
        }
      });

      // Fetch onboarding records
      const { data: onboarding } = await supabase
        .from('customer_onboarding')
        .select('*')
        .eq('account_id', accountId);

      onboarding?.forEach((ob) => {
        // Onboarding started
        if (ob.started_at) {
          timelineEvents.push({
            id: `onboarding-started-${ob.id}`,
            type: 'onboarding',
            action: 'onboarding_started',
            title: 'Onboarding started',
            description: `${ob.contact_name || ob.contact_email} began onboarding process`,
            timestamp: ob.started_at,
            metadata: { onboarding: ob }
          });
        }

        // Onboarding completed
        if (ob.completed_at) {
          timelineEvents.push({
            id: `onboarding-completed-${ob.id}`,
            type: 'onboarding',
            action: 'onboarding_completed',
            title: 'Onboarding completed',
            description: `${ob.contact_name || ob.contact_email} completed all ${ob.total_steps} steps`,
            timestamp: ob.completed_at,
            metadata: { onboarding: ob }
          });
        }

        // Onboarding created (if no started_at)
        if (!ob.started_at) {
          timelineEvents.push({
            id: `onboarding-created-${ob.id}`,
            type: 'onboarding',
            action: 'onboarding_created',
            title: 'Onboarding record created',
            description: `For ${ob.contact_name || ob.contact_email}`,
            timestamp: ob.created_at,
            metadata: { onboarding: ob }
          });
        }
      });

      // Fetch onboarding steps
      const onboardingIds = onboarding?.map(o => o.id) || [];
      if (onboardingIds.length > 0) {
        const { data: steps } = await supabase
          .from('onboarding_steps')
          .select('*')
          .in('onboarding_id', onboardingIds)
          .eq('is_completed', true);

        steps?.forEach((step) => {
          if (step.completed_at) {
            timelineEvents.push({
              id: `step-completed-${step.id}`,
              type: 'onboarding',
              action: 'step_completed',
              title: `Step completed: ${step.step_name}`,
              description: step.step_description || undefined,
              timestamp: step.completed_at,
              metadata: { step }
            });
          }
        });
      }

      // Fetch activities
      const { data: activities } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('account_id', accountId);

      activities?.forEach((activity) => {
        timelineEvents.push({
          id: `activity-${activity.id}`,
          type: 'activity',
          action: activity.activity_type,
          title: activity.subject,
          description: activity.description || undefined,
          timestamp: activity.completed_at || activity.created_at,
          metadata: { activity }
        });
      });

      // Fetch deals
      const { data: deals } = await supabase
        .from('crm_deals')
        .select('*')
        .eq('account_id', accountId);

      deals?.forEach((deal) => {
        // Deal created
        timelineEvents.push({
          id: `deal-created-${deal.id}`,
          type: 'deal',
          action: 'deal_created',
          title: `Deal created: ${deal.name}`,
          description: `$${deal.amount?.toLocaleString() || 0} - Stage: ${deal.stage}`,
          timestamp: deal.created_at,
          metadata: { deal }
        });

        // Deal closed
        if (deal.actual_close_date) {
          timelineEvents.push({
            id: `deal-closed-${deal.id}`,
            type: 'deal',
            action: deal.stage === 'closed_won' ? 'deal_won' : 'deal_lost',
            title: deal.stage === 'closed_won' ? `Deal won: ${deal.name}` : `Deal lost: ${deal.name}`,
            description: `$${deal.amount?.toLocaleString() || 0}`,
            timestamp: deal.actual_close_date,
            metadata: { deal }
          });
        }
      });

      // Fetch contacts
      const { data: contacts } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('account_id', accountId);

      contacts?.forEach((contact) => {
        timelineEvents.push({
          id: `contact-created-${contact.id}`,
          type: 'contact',
          action: 'contact_added',
          title: `Contact added: ${contact.first_name} ${contact.last_name}`,
          description: contact.job_title || contact.email || undefined,
          timestamp: contact.created_at,
          metadata: { contact }
        });
      });

      // Sort by timestamp descending
      return timelineEvents.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    enabled: !!accountId,
  });

  const getEventIcon = (event: TimelineEvent) => {
    const iconClass = "h-4 w-4";
    
    switch (event.type) {
      case 'license':
        if (event.action === 'license_activated') return <PlayCircle className={`${iconClass} text-green-500`} />;
        if (event.action === 'license_expired') return <XCircle className={`${iconClass} text-red-500`} />;
        return <Key className={`${iconClass} text-blue-500`} />;
      
      case 'onboarding':
        if (event.action === 'onboarding_completed') return <CheckCircle2 className={`${iconClass} text-green-500`} />;
        if (event.action === 'onboarding_started') return <PlayCircle className={`${iconClass} text-blue-500`} />;
        if (event.action === 'step_completed') return <CheckCircle2 className={`${iconClass} text-primary`} />;
        return <ClipboardList className={`${iconClass} text-purple-500`} />;
      
      case 'activity':
        if (event.action === 'call') return <Phone className={`${iconClass} text-green-500`} />;
        if (event.action === 'email') return <Mail className={`${iconClass} text-blue-500`} />;
        if (event.action === 'meeting') return <Users className={`${iconClass} text-purple-500`} />;
        if (event.action === 'demo') return <Presentation className={`${iconClass} text-orange-500`} />;
        if (event.action === 'note') return <FileText className={`${iconClass} text-gray-500`} />;
        return <MessageSquare className={`${iconClass} text-muted-foreground`} />;
      
      case 'deal':
        if (event.action === 'deal_won') return <CheckCircle2 className={`${iconClass} text-green-500`} />;
        if (event.action === 'deal_lost') return <XCircle className={`${iconClass} text-red-500`} />;
        return <DollarSign className={`${iconClass} text-yellow-500`} />;
      
      case 'contact':
        return <Users className={`${iconClass} text-blue-500`} />;
      
      default:
        return <Clock className={`${iconClass} text-muted-foreground`} />;
    }
  };

  const getEventBadge = (event: TimelineEvent) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      license: 'default',
      onboarding: 'secondary',
      activity: 'outline',
      deal: 'default',
      contact: 'outline',
    };
    
    return (
      <Badge variant={variants[event.type] || 'secondary'} className="text-xs">
        {event.type}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No activity recorded for this account</p>
        </CardContent>
      </Card>
    );
  }

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const date = format(new Date(event.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([date, dayEvents]) => (
        <div key={date} className="relative">
          <div className="sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
            <h4 className="text-sm font-medium text-muted-foreground">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h4>
          </div>
          
          <div className="relative pl-8 space-y-4 mt-2">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
            
            {dayEvents.map((event, index) => (
              <div key={event.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="absolute left-[-20px] flex items-center justify-center w-6 h-6 rounded-full bg-background border-2 border-border">
                  {getEventIcon(event)}
                </div>
                
                <Card className="flex-1 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getEventBadge(event)}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.timestamp), 'h:mm a')}
                          </span>
                        </div>
                        <h5 className="font-medium text-sm">{event.title}</h5>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountTimeline;
