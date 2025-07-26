import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Save, RefreshCw, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppSetting {
  id: string;
  key: string;
  value: any;
  description: string;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Mock settings for now since app_settings table doesn't exist yet
      const data = [
        { id: '1', key: 'site_name', value: 'ConvertTemp', description: 'Website name' },
        { id: '2', key: 'analytics_enabled', value: true, description: 'Enable analytics' }
      ];

      setSettings(data || []);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: "Error",
        description: "Failed to load application settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      setSaving(true);
      // Mock update for now
      console.log('Setting updated:', key, value);

      setSettings(prev => prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      ));

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    } catch (error) {
      console.error('Failed to update setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string, defaultValue: any = '') => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Application Settings</h2>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 bg-muted rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
              </CardHeader>
              <CardContent>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Application Settings</h2>
          <p className="text-muted-foreground">Configure global application settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSettings} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Site Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Site Configuration
          </CardTitle>
          <CardDescription>Basic website information and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={getSetting('site_name', 'ConvertTemp')}
                onChange={(e) => updateSetting('site_name', e.target.value)}
                placeholder="Enter site name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={getSetting('site_description', 'Professional temperature conversion tool')}
                onChange={(e) => updateSetting('site_description', e.target.value)}
                placeholder="Enter site description"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
          <CardDescription>Configure data collection and analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Enable conversion and user interaction tracking
              </p>
            </div>
            <Switch
              checked={getSetting('analytics_enabled', true)}
              onCheckedChange={(checked) => updateSetting('analytics_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Application behavior and maintenance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable to show maintenance page to users
              </p>
            </div>
            <Switch
              checked={getSetting('maintenance_mode', false)}
              onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>All Settings</CardTitle>
          <CardDescription>Complete list of application settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">{setting.key}</div>
                  <div className="text-sm text-muted-foreground">{setting.description}</div>
                </div>
                <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value)}
                </div>
              </div>
            ))}
            {settings.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No settings configured</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}