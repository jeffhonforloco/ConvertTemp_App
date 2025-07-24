import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, RefreshCw, Globe, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AppSettings {
  siteName: string;
  siteDescription: string;
  analyticsEnabled: boolean;
  maintenanceMode: boolean;
  defaultUnit: string;
  rateLimitEnabled: boolean;
  maxRequestsPerHour: number;
  enableNotifications: boolean;
  adminEmail: string;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    siteName: 'ConvertTemp',
    siteDescription: 'Free Temperature Converter - Celsius, Fahrenheit, Kelvin, Rankine',
    analyticsEnabled: true,
    maintenanceMode: false,
    defaultUnit: 'C',
    rateLimitEnabled: true,
    maxRequestsPerHour: 100,
    enableNotifications: true,
    adminEmail: 'admin@converttemp.com'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // In a real app, these would come from a settings table
      // For now, we'll use localStorage as a demo
      const savedSettings = localStorage.getItem('admin-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // In a real app, save to database
      localStorage.setItem('admin-settings', JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "Application settings have been updated successfully",
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('conversion_events').select('count', { count: 'exact', head: true });
      if (error) throw error;
      
      toast({
        title: "Database Connected",
        description: "Successfully connected to Supabase database",
      });
    } catch (error) {
      toast({
        title: "Database Error",
        description: "Failed to connect to database",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Application Settings</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 bg-muted rounded animate-pulse"></div>
                <div className="h-10 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Application Settings</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={testDatabaseConnection}>
            <Database className="w-4 h-4 mr-2" />
            Test Database
          </Button>
          <Button variant="outline" onClick={loadSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Site Configuration
            </CardTitle>
            <CardDescription>
              Basic website information and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="ConvertTemp"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Free Temperature Converter..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                placeholder="admin@converttemp.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Application Features */}
        <Card>
          <CardHeader>
            <CardTitle>Application Features</CardTitle>
            <CardDescription>
              Enable or disable application features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Track user interactions and conversions
                </p>
              </div>
              <Switch
                checked={settings.analyticsEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, analyticsEnabled: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Show maintenance page to users
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable admin notifications
                </p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultUnit">Default Temperature Unit</Label>
              <Select value={settings.defaultUnit} onValueChange={(value) => setSettings({ ...settings, defaultUnit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C">Celsius (°C)</SelectItem>
                  <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                  <SelectItem value="K">Kelvin (K)</SelectItem>
                  <SelectItem value="R">Rankine (°R)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
            <CardDescription>
              Configure API rate limiting settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">
                  Limit requests per IP address
                </p>
              </div>
              <Switch
                checked={settings.rateLimitEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, rateLimitEnabled: checked })}
              />
            </div>
            
            {settings.rateLimitEnabled && (
              <div className="space-y-2">
                <Label htmlFor="maxRequests">Max Requests per Hour</Label>
                <Input
                  id="maxRequests"
                  type="number"
                  value={settings.maxRequestsPerHour}
                  onChange={(e) => setSettings({ ...settings, maxRequestsPerHour: parseInt(e.target.value) || 100 })}
                  min="1"
                  max="10000"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Current system status and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Environment</Label>
                <p className="font-mono">Production</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Version</Label>
                <p className="font-mono">1.0.0</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Database</Label>
                <p className="font-mono">Supabase</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Updated</Label>
                <p className="font-mono">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}