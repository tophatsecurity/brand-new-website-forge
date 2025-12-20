import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LicenseValidationRequest {
  license_key: string;
  product_name?: string;
  host_identifier?: string;
  client_ip?: string;
}

interface LicenseValidationResponse {
  valid: boolean;
  license?: {
    id: string;
    product_name: string;
    tier_name: string;
    status: string;
    seats: number;
    max_hosts: number | null;
    allowed_networks: string[];
    concurrent_sessions: number;
    usage_hours_limit: number | null;
    expiry_date: string | null;
    features: string[];
    addons: string[];
    is_perpetual: boolean;
  };
  error?: string;
  error_code?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { license_key, product_name, host_identifier, client_ip }: LicenseValidationRequest = await req.json();

    if (!license_key) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "License key is required",
          error_code: "MISSING_LICENSE_KEY"
        } as LicenseValidationResponse),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Validating license: ${license_key}${product_name ? ` for product: ${product_name}` : ""}`);

    // Fetch the license with tier information
    let query = supabase
      .from("product_licenses")
      .select(`
        id,
        license_key,
        product_name,
        tier:license_tiers(name),
        status,
        seats,
        max_hosts,
        allowed_networks,
        concurrent_sessions,
        usage_hours_limit,
        expiry_date,
        features,
        addons,
        activation_date
      `)
      .eq("license_key", license_key);

    if (product_name) {
      query = query.eq("product_name", product_name);
    }

    const { data: license, error: fetchError } = await query.maybeSingle();

    if (fetchError) {
      console.error("Error fetching license:", fetchError);
      throw new Error("Failed to fetch license");
    }

    if (!license) {
      console.log(`License not found: ${license_key}`);
      return new Response(
        JSON.stringify({
          valid: false,
          error: "License not found",
          error_code: "LICENSE_NOT_FOUND"
        } as LicenseValidationResponse),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check license status
    if (license.status !== "active") {
      console.log(`License inactive: ${license_key}, status: ${license.status}`);
      return new Response(
        JSON.stringify({
          valid: false,
          error: `License is ${license.status}`,
          error_code: "LICENSE_INACTIVE"
        } as LicenseValidationResponse),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Determine if license is perpetual (Commercial or Free tiers, or no expiry)
    const tierName = license.tier?.name || "";
    const isPerpetual = tierName === "Commercial" || tierName === "Free" || !license.expiry_date;

    // Check expiry date (skip for perpetual licenses)
    if (!isPerpetual && license.expiry_date) {
      const expiryDate = new Date(license.expiry_date);
      if (expiryDate < new Date()) {
        console.log(`License expired: ${license_key}, expiry: ${license.expiry_date}`);
        
        // Update license status to expired
        await supabase
          .from("product_licenses")
          .update({ status: "expired" })
          .eq("id", license.id);

        return new Response(
          JSON.stringify({
            valid: false,
            error: "License has expired",
            error_code: "LICENSE_EXPIRED"
          } as LicenseValidationResponse),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Check network restrictions if client_ip is provided
    if (client_ip && license.allowed_networks && license.allowed_networks.length > 0) {
      const isNetworkAllowed = checkNetworkAllowed(client_ip, license.allowed_networks);
      if (!isNetworkAllowed) {
        console.log(`Network not allowed: ${client_ip} not in ${license.allowed_networks.join(", ")}`);
        return new Response(
          JSON.stringify({
            valid: false,
            error: "Client IP not in allowed networks",
            error_code: "NETWORK_NOT_ALLOWED"
          } as LicenseValidationResponse),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Update last_active timestamp
    await supabase
      .from("product_licenses")
      .update({ last_active: new Date().toISOString() })
      .eq("id", license.id);

    console.log(`License validated successfully: ${license_key}`);

    const response: LicenseValidationResponse = {
      valid: true,
      license: {
        id: license.id,
        product_name: license.product_name,
        tier_name: tierName,
        status: license.status,
        seats: license.seats,
        max_hosts: license.max_hosts,
        allowed_networks: license.allowed_networks || [],
        concurrent_sessions: license.concurrent_sessions || 1,
        usage_hours_limit: license.usage_hours_limit,
        expiry_date: isPerpetual ? null : license.expiry_date,
        features: license.features || [],
        addons: license.addons || [],
        is_perpetual: isPerpetual
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in validate-license function:", error);
    return new Response(
      JSON.stringify({
        valid: false,
        error: error.message || "Internal server error",
        error_code: "INTERNAL_ERROR"
      } as LicenseValidationResponse),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

// Simple CIDR check - checks if IP is in any of the allowed networks
function checkNetworkAllowed(clientIp: string, allowedNetworks: string[]): boolean {
  // For simplicity, we do basic matching
  // In production, use a proper CIDR library
  for (const network of allowedNetworks) {
    if (network.includes("/")) {
      // CIDR notation - basic prefix matching
      const [networkIp, prefixStr] = network.split("/");
      const prefix = parseInt(prefixStr, 10);
      
      if (ipMatchesCidr(clientIp, networkIp, prefix)) {
        return true;
      }
    } else {
      // Exact IP match
      if (clientIp === network) {
        return true;
      }
    }
  }
  return false;
}

function ipMatchesCidr(ip: string, networkIp: string, prefix: number): boolean {
  const ipParts = ip.split(".").map(Number);
  const networkParts = networkIp.split(".").map(Number);
  
  if (ipParts.length !== 4 || networkParts.length !== 4) {
    return false;
  }
  
  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const networkNum = (networkParts[0] << 24) | (networkParts[1] << 16) | (networkParts[2] << 8) | networkParts[3];
  const mask = ~((1 << (32 - prefix)) - 1);
  
  return (ipNum & mask) === (networkNum & mask);
}

serve(handler);
