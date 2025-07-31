import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Zap, Crown, Shield, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handlePayment = async (paymentType: 'one_time' | 'subscription', priceAmount: number) => {
    setLoading(paymentType);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          payment_type: paymentType,
          price_amount: priceAmount
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onClose();
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to start payment process",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Remove Ads & Support ConvertTemp</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* One-time Payment */}
            <Card className="border-2 relative">
              <div className="absolute -top-3 left-4">
                <Badge className="bg-green-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Remove Ads Forever</CardTitle>
                <CardDescription>One-time payment</CardDescription>
                <div className="text-4xl font-bold text-green-600 mt-2">
                  $4.99
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Remove all ads permanently</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">No recurring charges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Support development</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handlePayment('one_time', 4.99)}
                  disabled={loading === 'one_time'}
                >
                  {loading === 'one_time' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Pay $4.99 Once
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Subscription */}
            <Card className="border-2">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Premium Monthly</CardTitle>
                <CardDescription>Recurring subscription</CardDescription>
                <div className="text-4xl font-bold text-blue-600 mt-2">
                  $2.99<span className="text-sm text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Remove all ads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Early access to features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Cancel anytime</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={() => handlePayment('subscription', 2.99)}
                  disabled={loading === 'subscription'}
                >
                  {loading === 'subscription' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Subscribe for $2.99/mo
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
            <p>
              By purchasing, you help support the development and hosting of ConvertTemp.
              {!user && " You can checkout as a guest or create an account to manage your subscription."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subscription management component for authenticated users
export function SubscriptionManager() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  if (loading) {
    return <div className="text-center">Loading subscription status...</div>;
  }

  if (!subscriptionStatus) return null;

  const { subscribed, one_time_payment, subscription_tier, subscription_end } = subscriptionStatus;
  const hasPremium = subscribed || one_time_payment;

  if (!hasPremium) return null;

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              {one_time_payment ? 'Ad-Free Forever' : `Premium ${subscription_tier}`}
            </h3>
            <p className="text-sm text-green-600">
              {one_time_payment 
                ? 'You have lifetime ad-free access!' 
                : `Active until ${new Date(subscription_end).toLocaleDateString()}`
              }
            </p>
          </div>
          {subscribed && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openCustomerPortal}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              Manage Subscription
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}