import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const CreateDemoAdmin = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createDemoAdmin = async () => {
    setLoading(true);
    try {
      // First try to sign up the admin user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@converttemp.com',
        password: 'admin123',
        options: {
          data: {
            full_name: 'Demo Admin'
          }
        }
      });

      if (signUpError && !signUpError.message.includes('already registered')) {
        throw signUpError;
      }

      toast({
        title: "Demo Admin Created",
        description: "You can now login with admin@converttemp.com / admin123",
      });

    } catch (error: any) {
      toast({
        title: "Admin Creation",
        description: error.message.includes('already registered') 
          ? "Demo admin already exists - you can login with admin@converttemp.com / admin123"
          : error.message,
        variant: error.message.includes('already registered') ? "default" : "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={createDemoAdmin} 
      disabled={loading}
      variant="outline"
      className="mb-4"
    >
      {loading ? "Creating..." : "Create Demo Admin"}
    </Button>
  );
};