import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalyticsSummary, mockAnalytics, ConversionLog } from '@/lib/mock-analytics';
import { SimpleBarChart, SimpleLineChart } from '@/components/SimpleChart';
import { TrendingUp, Users, Activity, Thermometer, Download, Trash2 } from 'lucide-react';

export function AdminDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentLogs, setRecentLogs] = useState<ConversionLog[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const analyticsData = mockAnalytics.getAnalyticsSummary();
    const logs = mockAnalytics.getConversionLogs().slice(-20).reverse(); // Last 20 logs
    setSummary(analyticsData);
    setRecentLogs(logs);
  };

  const exportData = () => {
    const data = mockAnalytics.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converttemp-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      mockAnalytics.clearData();
      loadData();
    }
  };

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <Button variant="outline" onClick={exportData} className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button variant="destructive" onClick={clearData} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Clear Data
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