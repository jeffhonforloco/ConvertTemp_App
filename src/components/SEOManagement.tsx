import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  RefreshCw,
  Globe,
  FileText,
  Tags
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SEOPage {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function SEOManagement() {
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<SEOPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const defaultPage: Partial<SEOPage> = {
    path: '',
    title: '',
    description: '',
    keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    is_active: true
  };

  useEffect(() => {
    loadSEOPages();
  }, []);

  const loadSEOPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Failed to load SEO pages:', error);
      toast({
        title: "Error",
        description: "Failed to load SEO pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePage = async (pageData: Partial<SEOPage>) => {
    try {
      if (editingPage) {
        // Update existing page
        const { error } = await supabase
          .from('seo_pages')
          .update(pageData)
          .eq('id', editingPage.id);

        if (error) throw error;

        setPages(prev => prev.map(page => 
          page.id === editingPage.id ? { ...page, ...pageData } : page
        ));

        toast({
          title: "Success",
          description: "SEO page updated successfully",
        });
      } else {
        // Create new page
        const { data, error } = await supabase
          .from('seo_pages')
          .insert([pageData as any])
          .select()
          .single();

        if (error) throw error;

        setPages(prev => [data, ...prev]);

        toast({
          title: "Success",
          description: "SEO page created successfully",
        });
      }

      setEditingPage(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to save SEO page:', error);
      toast({
        title: "Error",
        description: "Failed to save SEO page",
        variant: "destructive",
      });
    }
  };

  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seo_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPages(prev => prev.filter(page => page.id !== id));

      toast({
        title: "Success",
        description: "SEO page deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete SEO page:', error);
      toast({
        title: "Error",
        description: "Failed to delete SEO page",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">SEO Management</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 bg-muted rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isCreating || editingPage) {
    const currentPage = editingPage || defaultPage;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingPage ? 'Edit SEO Page' : 'Create SEO Page'}
          </h2>
          <Button variant="outline" onClick={() => {
            setEditingPage(null);
            setIsCreating(false);
          }}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Page Information</CardTitle>
            <CardDescription>Basic page details and metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="path">URL Path</Label>
                <Input
                  id="path"
                  value={currentPage.path || ''}
                  onChange={(e) => setEditingPage(prev => ({ ...prev!, path: e.target.value }))}
                  placeholder="/example-page"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  value={currentPage.canonical_url || ''}
                  onChange={(e) => setEditingPage(prev => ({ ...prev!, canonical_url: e.target.value }))}
                  placeholder="https://converttemp.com/example-page"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={currentPage.title || ''}
                onChange={(e) => setEditingPage(prev => ({ ...prev!, title: e.target.value }))}
                placeholder="Enter page title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                value={currentPage.description || ''}
                onChange={(e) => setEditingPage(prev => ({ ...prev!, description: e.target.value }))}
                placeholder="Enter meta description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={currentPage.keywords?.join(', ') || ''}
                onChange={(e) => setEditingPage(prev => ({ 
                  ...prev!, 
                  keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                }))}
                placeholder="temperature, converter, celsius, fahrenheit"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={() => savePage(currentPage)} className="gap-2">
            <Save className="w-4 h-4" />
            {editingPage ? 'Update Page' : 'Create Page'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO Management</h2>
          <p className="text-muted-foreground">Manage page metadata and search optimization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSEOPages} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Page
          </Button>
        </div>
      </div>

      {/* SEO Pages List */}
      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{page.path}</span>
                      {page.is_active ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPage(page)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePage(page.id)}
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </div>
                {page.keywords && page.keywords.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tags className="w-4 h-4 text-muted-foreground" />
                    {page.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(page.updated_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pages.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No SEO pages configured</p>
              <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Page
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}