import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const endpoint = new URL(req.url).pathname;
    
    // Check rate limit (100 requests per hour)
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const { data: rateLimits, error } = await supabase
      .from('rate_limits')
      .select('requests_count')
      .eq('ip_address', clientIP)
      .eq('endpoint', endpoint)
      .gte('window_start', hourAgo.toISOString());

    if (error) throw error;

    const totalRequests = rateLimits?.reduce((sum, limit) => sum + limit.requests_count, 0) || 0;
    
    if (totalRequests >= 100) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log this request
    await supabase.from('rate_limits').insert({
      ip_address: clientIP,
      endpoint: endpoint,
      requests_count: 1,
      window_start: new Date().toISOString()
    });

    return new Response(JSON.stringify({ allowed: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});