import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, Search, Globe, TrendingUp, Plus } from 'lucide-react';

interface SEOPage {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  schema_markup: any;
  is_active: boolean;
}

export function SEOManagement() {
  const [seoPages, setSeoPages] = useState<SEOPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSEOPages();
  }, []);

  const fetchSEOPages = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .order('path');

      if (error) throw error;
      setSeoPages(data || []);
      if (data && data.length > 0 && !selectedPage) {
        setSelectedPage(data[0]);
      }
    } catch (error) {
      console.error('Error fetching SEO pages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch SEO pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSEOPage = async (id: string, updates: Partial<SEOPage>) => {
    try {
      const { error } = await supabase
        .from('seo_pages')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setSeoPages(prev => 
        prev.map(page => 
          page.id === id ? { ...page, ...updates } : page
        )
      );

      if (selectedPage?.id === id) {
        setSelectedPage(prev => prev ? { ...prev, ...updates } : null);
      }

      toast({
        title: "Success",
        description: "SEO settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating SEO page:', error);
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive",
      });
    }
  };

  const createSEOPage = async () => {
    try {
      const newPath = `/new-page-${Date.now()}`;
      const { data, error } = await supabase
        .from('seo_pages')
        .insert({
          path: newPath,
          title: 'New Page Title',
          description: 'New page description',
          keywords: [],
          is_active: false
        })
        .select()
        .single();

      if (error) throw error;

      setSeoPages(prev => [...prev, data]);
      setSelectedPage(data);

      toast({
        title: "Success",
        description: "New SEO page created",
      });
    } catch (error) {
      console.error('Error creating SEO page:', error);
      toast({
        title: "Error",
        description: "Failed to create SEO page",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pages List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO Pages
            </CardTitle>
            <Button onClick={createSEOPage} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {seoPages.map((page) => (
              <div
                key={page.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPage?.id === page.id 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedPage(page)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{page.path}</div>
                  {page.is_active && <Badge variant="secondary" className="text-xs">Active</Badge>}
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {page.title}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      {selectedPage && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO Settings: {selectedPage.path}
              </CardTitle>
              <Switch
                checked={selectedPage.is_active}
                onCheckedChange={(checked) => 
                  updateSEOPage(selectedPage.id, { is_active: checked })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic SEO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic SEO</h3>
              
              <div className="space-y-2">
                <Label htmlFor="path">Page Path</Label>
                <Input
                  id="path"
                  value={selectedPage.path}
                  onChange={(e) => 
                    setSelectedPage(prev => prev ? { ...prev, path: e.target.value } : null)
                  }
                  placeholder="/page-path"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Meta Title</Label>
                <Input
                  id="title"
                  value={selectedPage.title}
                  onChange={(e) => 
                    setSelectedPage(prev => prev ? { ...prev, title: e.target.value } : null)
                  }
                  placeholder="Page title for search engines"
                />
                <p className="text-xs text-muted-foreground">
                  {selectedPage.title.length}/60 characters (optimal: 50-60)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  value={selectedPage.description}
                  onChange={(e) => 
                    setSelectedPage(prev => prev ? { ...prev, description: e.target.value } : null)
                  }
                  placeholder="Brief description for search results"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedPage.description.length}/160 characters (optimal: 150-160)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={selectedPage.keywords.join(', ')}
                  onChange={(e) => 
                    setSelectedPage(prev => prev ? { 
                      ...prev, 
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    } : null)
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical">Canonical URL (optional)</Label>
                <Input
                  id="canonical"
                  value={selectedPage.canonical_url || ''}
                  onChange={(e) => 
                    setSelectedPage(prev => prev ? { ...prev, canonical_url: e.target.value || null } : null)
                  }
                  placeholder="https://example.com/canonical-url"
                />
              </div>
            </div>

            {/* Open Graph */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Open Graph (Social Media)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={selectedPage.og_title || ''}
                  onChange={(e) => 
                    setSelectedPage(prev => prev ? { ...prev, og_title: e.target.value || null } : null)
                  }
                  placeholder="Title for social media sharing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  value={selectedPage.og_description || ''}
                  onChange={(e) => 
                    setSelectedPage(prev => prev ? { ...prev, og_description: e.target.value || null } : null)
                  }
                  placeholder="Description for social media sharing"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  value={selectedPage.og_image || ''}
                  onChange={(e) => 
                    setSelectedPage(prev => prev ? { ...prev, og_image: e.target.value || null } : null)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <Button
              onClick={() => updateSEOPage(selectedPage.id, {
                path: selectedPage.path,
                title: selectedPage.title,
                description: selectedPage.description,
                keywords: selectedPage.keywords,
                canonical_url: selectedPage.canonical_url,
                og_title: selectedPage.og_title,
                og_description: selectedPage.og_description,
                og_image: selectedPage.og_image
              })}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Save SEO Settings
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}