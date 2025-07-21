import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleBarChart, SimpleLineChart } from '@/components/SimpleChart';
import { TrendingUp, Users, Activity, Thermometer, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsSummary {
  totalConversions: number;
  conversionsToday: number;
  totalUsers: number;
  totalSessions: number;
  conversionsThisMonth: number;
  conversionsByDay: Array<{ date: string; count: number }>;
  mostUsedUnits: Array<{ unit: string; count: number }>;
  popularConversions: Array<{ from: string; to: string; count: number }>;
}

interface ConversionLog {
  id: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  method: string;
  timestamp: string;
}

export function AdminDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentLogs, setRecentLogs] = useState<ConversionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get total conversions
      const { count: totalConversions } = await supabase
        .from('conversion_events')
        .select('*', { count: 'exact', head: true });

      // Get conversions today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: conversionsToday } = await supabase
        .from('conversion_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get unique users and sessions
      const { data: uniqueUserData } = await supabase
        .from('conversion_events')
        .select('user_id, session_id');
      
      const totalUsers = new Set(uniqueUserData?.map(u => u.user_id)).size;
      const totalSessions = new Set(uniqueUserData?.map(u => u.session_id)).size;

      // Get conversions this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count: conversionsThisMonth } = await supabase
        .from('conversion_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Get conversions by day (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();
      
      const conversionsByDay = await Promise.all(
        last7Days.map(async (date) => {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          
          const { count } = await supabase
            .from('conversion_events')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString());

          return {
            date: date.toISOString(),
            count: count || 0
          };
        })
      );

      // Get most used units
      const { data: allConversions } = await supabase
        .from('conversion_events')
        .select('from_unit, to_unit');

      const unitCounts: Record<string, number> = {};
      allConversions?.forEach(c => {
        unitCounts[c.from_unit] = (unitCounts[c.from_unit] || 0) + 1;
        unitCounts[c.to_unit] = (unitCounts[c.to_unit] || 0) + 1;
      });

      const mostUsedUnits = Object.entries(unitCounts)
        .map(([unit, count]) => ({ unit, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get popular conversions
      const conversionPairCounts: Record<string, number> = {};
      allConversions?.forEach(c => {
        const key = `${c.from_unit}-${c.to_unit}`;
        conversionPairCounts[key] = (conversionPairCounts[key] || 0) + 1;
      });

      const popularConversions = Object.entries(conversionPairCounts)
        .map(([pair, count]) => {
          const [from, to] = pair.split('-');
          return { from, to, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get recent logs
      const { data: recentData } = await supabase
        .from('conversion_events')
        .select('id, from_unit, to_unit, from_value, to_value, method, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      const logs: ConversionLog[] = recentData?.map(log => ({
        id: log.id,
        fromUnit: log.from_unit,
        toUnit: log.to_unit,
        fromValue: log.from_value,
        toValue: log.to_value,
        method: log.method,
        timestamp: log.created_at
      })) || [];

      setSummary({
        totalConversions: totalConversions || 0,
        conversionsToday: conversionsToday || 0,
        totalUsers,
        totalSessions,
        conversionsThisMonth: conversionsThisMonth || 0,
        conversionsByDay,
        mostUsedUnits,
        popularConversions
      });
      setRecentLogs(logs);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse mb-1"></div>
                <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Temperature conversion insights and usage statistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} className="gap-2" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Thermometer className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.conversionsToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Tracked anonymously
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total user sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.conversionsThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Conversions in {new Date().toLocaleDateString('en-US', { month: 'long' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Unit Usage</TabsTrigger>
          <TabsTrigger value="conversions">Popular Conversions</TabsTrigger>
          <TabsTrigger value="logs">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SimpleLineChart 
            data={summary.conversionsByDay}
            title="Conversions Over Time (Last 7 Days)"
            description="Daily conversion activity"
          />
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <SimpleBarChart 
            data={summary.mostUsedUnits.map(unit => ({ name: unit.unit, value: unit.count }))}
            title="Most Used Temperature Units"
            description="Which units users convert from most often"
          />
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Conversion Pairs</CardTitle>
              <CardDescription>Most frequently requested unit conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.popularConversions.map((conversion, index) => (
                  <div key={`${conversion.from}-${conversion.to}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-medium">{conversion.from}° → {conversion.to}°</span>
                    </div>
                    <Badge>{conversion.count} conversions</Badge>
                  </div>
                ))}
                {summary.popularConversions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No conversion data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversion Activity</CardTitle>
              <CardDescription>Latest 20 temperature conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{log.method}</Badge>
                      <span>{log.fromValue}°{log.fromUnit} → {log.toValue.toFixed(2)}°{log.toUnit}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
                {recentLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No conversion activity yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}