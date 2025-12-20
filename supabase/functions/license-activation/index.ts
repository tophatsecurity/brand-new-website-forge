import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ActivationRequest {
  license_key: string;
  host_identifier: string;
  host_name?: string;
  host_ip?: string;
  action: "activate" | "deactivate" | "heartbeat" | "status";
  metadata?: Record<string, any>;
}

interface ActivationResponse {
  success: boolean;
  action: string;
  activation?: {
    id: string;
    host_identifier: string;
    activated_at: string;
    is_active: boolean;
  };
  license_info?: {
    max_hosts: number | null;
    active_hosts: number;
    remaining_slots: number | null;
  };
  error?: string;
  error_code?: string;
}

const handler = async (req: Request): Promise<Response> => {
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
    const { license_key, host_identifier, host_name, host_ip, action, metadata }: ActivationRequest = await req.json();

    if (!license_key || !host_identifier) {
      return jsonResponse(400, {
        success: false,
        action,
        error: "license_key and host_identifier are required",
        error_code: "MISSING_PARAMS"
      });
    }

    console.log(`License activation: ${action} for ${license_key}, host: ${host_identifier}`);

    // Fetch the license
    const { data: license, error: licenseError } = await supabase
      .from("product_licenses")
      .select("id, license_key, product_name, max_hosts, status")
      .eq("license_key", license_key)
      .maybeSingle();

    if (licenseError || !license) {
      return jsonResponse(404, {
        success: false,
        action,
        error: "License not found",
        error_code: "LICENSE_NOT_FOUND"
      });
    }

    if (license.status !== "active") {
      return jsonResponse(403, {
        success: false,
        action,
        error: `License is ${license.status}`,
        error_code: "LICENSE_INACTIVE"
      });
    }

    // Get current active host count
    const { count: activeHostCount } = await supabase
      .from("license_activations")
      .select("*", { count: "exact", head: true })
      .eq("license_id", license.id)
      .eq("is_active", true);

    const currentActiveHosts = activeHostCount || 0;

    switch (action) {
      case "activate": {
        // Check if host is already activated
        const { data: existing } = await supabase
          .from("license_activations")
          .select("id, is_active")
          .eq("license_id", license.id)
          .eq("host_identifier", host_identifier)
          .maybeSingle();

        if (existing?.is_active) {
          // Already active, just update last_seen
          await supabase
            .from("license_activations")
            .update({ last_seen_at: new Date().toISOString() })
            .eq("id", existing.id);

          return jsonResponse(200, {
            success: true,
            action: "activate",
            activation: {
              id: existing.id,
              host_identifier,
              activated_at: new Date().toISOString(),
              is_active: true
            },
            license_info: getLicenseInfo(license.max_hosts, currentActiveHosts)
          });
        }

        // Check max_hosts limit
        if (license.max_hosts !== null && currentActiveHosts >= license.max_hosts) {
          return jsonResponse(403, {
            success: false,
            action: "activate",
            error: `Maximum hosts limit reached (${license.max_hosts})`,
            error_code: "MAX_HOSTS_REACHED",
            license_info: getLicenseInfo(license.max_hosts, currentActiveHosts)
          });
        }

        // Activate or reactivate
        if (existing) {
          // Reactivate existing
          const { error: updateError } = await supabase
            .from("license_activations")
            .update({
              is_active: true,
              last_seen_at: new Date().toISOString(),
              host_name: host_name || existing.host_name,
              host_ip: host_ip || existing.host_ip,
              metadata: metadata || {}
            })
            .eq("id", existing.id);

          if (updateError) throw updateError;

          return jsonResponse(200, {
            success: true,
            action: "activate",
            activation: {
              id: existing.id,
              host_identifier,
              activated_at: new Date().toISOString(),
              is_active: true
            },
            license_info: getLicenseInfo(license.max_hosts, currentActiveHosts + 1)
          });
        } else {
          // Create new activation
          const { data: newActivation, error: insertError } = await supabase
            .from("license_activations")
            .insert({
              license_id: license.id,
              host_identifier,
              host_name,
              host_ip,
              metadata: metadata || {}
            })
            .select("id")
            .single();

          if (insertError) throw insertError;

          return jsonResponse(200, {
            success: true,
            action: "activate",
            activation: {
              id: newActivation.id,
              host_identifier,
              activated_at: new Date().toISOString(),
              is_active: true
            },
            license_info: getLicenseInfo(license.max_hosts, currentActiveHosts + 1)
          });
        }
      }

      case "deactivate": {
        const { error: deactivateError } = await supabase
          .from("license_activations")
          .update({ is_active: false, last_seen_at: new Date().toISOString() })
          .eq("license_id", license.id)
          .eq("host_identifier", host_identifier);

        if (deactivateError) throw deactivateError;

        return jsonResponse(200, {
          success: true,
          action: "deactivate",
          activation: {
            id: "",
            host_identifier,
            activated_at: "",
            is_active: false
          },
          license_info: getLicenseInfo(license.max_hosts, Math.max(0, currentActiveHosts - 1))
        });
      }

      case "heartbeat": {
        const { data: activation } = await supabase
          .from("license_activations")
          .select("id, is_active")
          .eq("license_id", license.id)
          .eq("host_identifier", host_identifier)
          .maybeSingle();

        if (!activation?.is_active) {
          return jsonResponse(403, {
            success: false,
            action: "heartbeat",
            error: "Host is not activated",
            error_code: "NOT_ACTIVATED"
          });
        }

        await supabase
          .from("license_activations")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", activation.id);

        return jsonResponse(200, {
          success: true,
          action: "heartbeat",
          activation: {
            id: activation.id,
            host_identifier,
            activated_at: "",
            is_active: true
          },
          license_info: getLicenseInfo(license.max_hosts, currentActiveHosts)
        });
      }

      case "status": {
        const { data: activations } = await supabase
          .from("license_activations")
          .select("id, host_identifier, host_name, host_ip, activated_at, last_seen_at, is_active")
          .eq("license_id", license.id)
          .order("activated_at", { ascending: false });

        return jsonResponse(200, {
          success: true,
          action: "status",
          license_info: getLicenseInfo(license.max_hosts, currentActiveHosts),
          activations: activations || []
        });
      }

      default:
        return jsonResponse(400, {
          success: false,
          action,
          error: "Invalid action. Use: activate, deactivate, heartbeat, or status",
          error_code: "INVALID_ACTION"
        });
    }

  } catch (error: any) {
    console.error("Error in license-activation function:", error);
    return jsonResponse(500, {
      success: false,
      action: "unknown",
      error: error.message || "Internal server error",
      error_code: "INTERNAL_ERROR"
    });
  }
};

function getLicenseInfo(maxHosts: number | null, activeHosts: number) {
  return {
    max_hosts: maxHosts,
    active_hosts: activeHosts,
    remaining_slots: maxHosts !== null ? Math.max(0, maxHosts - activeHosts) : null
  };
}

function jsonResponse(status: number, body: any): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
}

serve(handler);
