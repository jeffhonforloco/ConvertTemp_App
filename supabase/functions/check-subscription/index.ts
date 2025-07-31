import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    // Use service role key to perform writes
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user info (can be null for guests)
    let user = null;
    let userEmail = null;
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      user = userData.user;
      userEmail = user?.email;
    }

    // Try to get email from request body if no auth
    if (!userEmail) {
      try {
        const body = await req.json();
        userEmail = body.email;
      } catch (e) {
        // No body or email provided
      }
    }

    if (!userEmail) {
      return new Response(JSON.stringify({ 
        subscribed: false, 
        one_time_payment: false,
        error: "No email provided" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Checking subscription for email", { email: userEmail });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check Stripe for customer
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    
    let subscribed = false;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let oneTimePayment = false;

    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId });

      // Check for active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      
      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        subscribed = true;
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        
        // Determine tier based on price
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount <= 299) subscriptionTier = "Basic";
        else if (amount <= 499) subscriptionTier = "Premium";
        else subscriptionTier = "Pro";
        
        logStep("Active subscription found", { tier: subscriptionTier, endDate: subscriptionEnd });
      }

      // Check for successful one-time payments
      const payments = await stripe.checkout.sessions.list({
        customer: customerId,
        limit: 10,
      });
      
      for (const session of payments.data) {
        if (session.payment_status === "paid" && session.mode === "payment") {
          oneTimePayment = true;
          logStep("One-time payment found", { sessionId: session.id });
          break;
        }
      }
    }

    // Update subscribers table
    if (user) {
      await supabaseClient.from("subscribers").upsert({
        email: userEmail,
        user_id: user.id,
        stripe_customer_id: customers.data[0]?.id || null,
        subscribed,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        one_time_payment: oneTimePayment,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
    }

    logStep("Database updated", { subscribed, oneTimePayment, subscriptionTier });

    return new Response(JSON.stringify({
      subscribed,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      one_time_payment: oneTimePayment,
      has_premium: subscribed || oneTimePayment
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      error: errorMessage, 
      subscribed: false, 
      one_time_payment: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});