import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ThumbsUp, CheckCircle, Clock, TrendingUp, User } from 'lucide-react';

interface ScoreboardProps {
  requests: any[];
  userId?: string;
  userEmail?: string;
  showUserStats?: boolean;
}

const FeatureRequestScoreboard = ({ requests, userId, userEmail, showUserStats = false }: ScoreboardProps) => {
  // Overall stats
  const totalRequests = requests?.length || 0;
  const totalVotes = requests?.reduce((sum, r) => sum + (r.vote_count || 0), 0) || 0;
  const implementedCount = requests?.filter(r => r.status === 'implemented').length || 0;
  const inProgressCount = requests?.filter(r => r.status === 'in_progress' || r.status === 'planned').length || 0;
  
  // User-specific stats
  const userRequests = requests?.filter(r => r.submitted_by === userId || r.submitted_by_email === userEmail) || [];
  const userRequestCount = userRequests.length;
  const userTotalVotes = userRequests.reduce((sum, r) => sum + (r.vote_count || 0), 0);
  
  // Top voted request
  const topVoted = requests?.reduce((max, r) => (!max || r.vote_count > max.vote_count) ? r : max, null);

  const stats = [
    {
      label: 'Total Requests',
      value: totalRequests,
      icon: Lightbulb,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Votes',
      value: totalVotes,
      icon: ThumbsUp,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Implemented',
      value: implementedCount,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const userStats = showUserStats && userId ? [
    {
      label: 'Your Requests',
      value: userRequestCount,
      icon: User,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'Votes on Your Ideas',
      value: userTotalVotes,
      icon: TrendingUp,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
  ] : [];

  const displayStats = [...stats, ...userStats];

  return (
    <div className="space-y-4 mb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayStats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Voted Feature */}
      {topVoted && topVoted.vote_count > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Most Voted Request</p>
                <p className="font-medium truncate">{topVoted.title}</p>
              </div>
              <div className="flex items-center gap-1 text-primary font-bold">
                <ThumbsUp className="h-4 w-4" />
                <span>{topVoted.vote_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeatureRequestScoreboard;
