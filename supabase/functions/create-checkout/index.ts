import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { payment_type, price_amount } = await req.json();
    
    if (!payment_type || !price_amount) {
      throw new Error("Missing payment_type or price_amount");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured. Please add it in Supabase settings.");
    }
    logStep("Stripe key verified");

    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header (optional for one-time payments)
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      user = userData.user;
      logStep("User authenticated", { userId: user?.id, email: user?.email });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // For guests, use a default email
    const customerEmail = user?.email || "guest@converttemp.com";
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    const origin = req.headers.get("origin") || "https://converttemp.com";
    let sessionData;

    if (payment_type === "subscription") {
      // Monthly subscription
      sessionData = {
        customer: customerId,
        customer_email: customerId ? undefined : customerEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: "ConvertTemp Premium - Ad-Free Experience",
                description: "Remove ads and support ConvertTemp development"
              },
              unit_amount: price_amount * 100, // Convert to cents
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/?payment=success&type=subscription`,
        cancel_url: `${origin}/?payment=cancelled`,
      };
    } else {
      // One-time payment
      sessionData = {
        customer: customerId,
        customer_email: customerId ? undefined : customerEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: "ConvertTemp - Remove Ads Forever",
                description: "One-time payment to remove ads permanently"
              },
              unit_amount: price_amount * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/?payment=success&type=one_time`,
        cancel_url: `${origin}/?payment=cancelled`,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionData);
    logStep("Checkout session created", { sessionId: session.id, mode: payment_type });

    // Store order in database
    await supabaseClient.from("orders").insert({
      user_id: user?.id || null,
      email: customerEmail,
      stripe_session_id: session.id,
      amount: price_amount * 100,
      currency: "usd",
      status: "pending",
      payment_type: payment_type,
    });

    logStep("Order stored in database");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});