import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

type ChartData = {
  date: string;
  downloads: number;
  displayDate: string;
};

export const DownloadTrendsChart = () => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['download-trends'],
    queryFn: async () => {
      // Get downloads from the last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      
      const { data, error } = await supabase
        .from('download_statistics')
        .select('downloaded_at')
        .gte('downloaded_at', thirtyDaysAgo.toISOString())
        .order('downloaded_at', { ascending: true });
        
      if (error) throw error;
      
      // Generate all days in the range
      const days = eachDayOfInterval({
        start: thirtyDaysAgo,
        end: new Date()
      });
      
      // Count downloads per day
      const countsByDay: Record<string, number> = {};
      days.forEach(day => {
        countsByDay[format(day, 'yyyy-MM-dd')] = 0;
      });
      
      data?.forEach(stat => {
        const day = format(new Date(stat.downloaded_at), 'yyyy-MM-dd');
        if (countsByDay[day] !== undefined) {
          countsByDay[day]++;
        }
      });
      
      // Convert to chart data
      return Object.entries(countsByDay).map(([date, downloads]) => ({
        date,
        downloads,
        displayDate: format(new Date(date), 'MMM d')
      })) as ChartData[];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Download Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData && chartData.some(d => d.downloads > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Download Trends (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                formatter={(value: number) => [value, 'Downloads']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="downloads"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#downloadGradient)"
                name="Downloads"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No download data available for the last 30 days
          </div>
        )}
      </CardContent>
    </Card>
  );
};
