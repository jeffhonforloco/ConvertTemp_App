import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, DollarSign, TrendingUp, Eye, MousePointer } from 'lucide-react';

interface AdNetwork {
  id: string;
  network_type: 'google_adsense' | 'media_net' | 'propeller_ads' | 'ezoic';
  name: string;
  publisher_id: string | null;
  api_key: string | null;
  is_active: boolean;
  revenue_share: number;
}

interface RevenueData {
  network_id: string;
  network_name: string;
  date: string;
  impressions: number;
  clicks: number;
  revenue: number;
  cpm: number;
  cpc: number;
}

export function AdNetworkManagement() {
  const [adNetworks, setAdNetworks] = useState<AdNetwork[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdNetworks();
    fetchRevenueData();
  }, []);

  const fetchAdNetworks = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_networks')
        .select('*')
        .order('name');

      if (error) throw error;
      setAdNetworks(data || []);
    } catch (error) {
      console.error('Error fetching ad networks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ad networks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_revenue')
        .select(`
          *,
          ad_networks!inner(name)
        `)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        network_id: item.network_id,
        network_name: item.ad_networks.name,
        date: item.date,
        impressions: item.impressions || 0,
        clicks: item.clicks || 0,
        revenue: parseFloat(item.revenue?.toString() || '0'),
        cpm: parseFloat(item.cpm?.toString() || '0'),
        cpc: parseFloat(item.cpc?.toString() || '0'),
      })) || [];

      setRevenueData(formattedData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const updateAdNetwork = async (id: string, updates: Partial<AdNetwork>) => {
    try {
      const { error } = await supabase
        .from('ad_networks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setAdNetworks(prev => 
        prev.map(network => 
          network.id === id ? { ...network, ...updates } : network
        )
      );

      toast({
        title: "Success",
        description: "Ad network updated successfully",
      });
    } catch (error) {
      console.error('Error updating ad network:', error);
      toast({
        title: "Error",
        description: "Failed to update ad network",
        variant: "destructive",
      });
    }
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalImpressions = revenueData.reduce((sum, item) => sum + item.impressions, 0);
  const totalClicks = revenueData.reduce((sum, item) => sum + item.clicks, 0);
  const avgCPM = totalImpressions > 0 ? (totalRevenue / totalImpressions) * 1000 : 0;
  const activeNetworks = adNetworks.filter(n => n.is_active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CPM</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgCPM.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Across active networks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Networks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeNetworks}</div>
            <p className="text-xs text-muted-foreground">Out of {adNetworks.length} configured</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="networks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="networks">Network Configuration</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="networks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adNetworks.map((network) => (
              <Card key={network.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {network.name}
                      {network.is_active && <Badge variant="secondary">Active</Badge>}
                    </CardTitle>
                    <Switch
                      checked={network.is_active}
                      onCheckedChange={(checked) => 
                        updateAdNetwork(network.id, { is_active: checked })
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`publisher-${network.id}`}>Publisher ID</Label>
                    <Input
                      id={`publisher-${network.id}`}
                      value={network.publisher_id || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAdNetworks(prev => 
                          prev.map(n => 
                            n.id === network.id ? { ...n, publisher_id: value } : n
                          )
                        );
                      }}
                      placeholder={`Enter ${network.name} Publisher ID`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`api-${network.id}`}>API Key (Optional)</Label>
                    <Input
                      id={`api-${network.id}`}
                      type="password"
                      value={network.api_key || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAdNetworks(prev => 
                          prev.map(n => 
                            n.id === network.id ? { ...n, api_key: value } : n
                          )
                        );
                      }}
                      placeholder="Enter API Key for revenue tracking"
                    />
                  </div>
                  
                  <Button
                    onClick={() => updateAdNetwork(network.id, {
                      publisher_id: network.publisher_id,
                      api_key: network.api_key
                    })}
                    className="w-full"
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Network (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {revenueData.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No revenue data available yet. Connect your ad networks to start tracking revenue.
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    revenueData.reduce((acc, item) => {
                      if (!acc[item.network_name]) {
                        acc[item.network_name] = {
                          revenue: 0,
                          impressions: 0,
                          clicks: 0,
                          cpm: 0
                        };
                      }
                      acc[item.network_name].revenue += item.revenue;
                      acc[item.network_name].impressions += item.impressions;
                      acc[item.network_name].clicks += item.clicks;
                      return acc;
                    }, {} as Record<string, any>)
                  ).map(([networkName, data]) => (
                    <div key={networkName} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{networkName}</h3>
                        <Badge variant="outline">
                          ${data.revenue.toFixed(2)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="block">Impressions</span>
                          <span className="font-medium text-foreground">
                            {data.impressions.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block">Clicks</span>
                          <span className="font-medium text-foreground">
                            {data.clicks.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block">CPM</span>
                          <span className="font-medium text-foreground">
                            ${data.impressions > 0 ? ((data.revenue / data.impressions) * 1000).toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}