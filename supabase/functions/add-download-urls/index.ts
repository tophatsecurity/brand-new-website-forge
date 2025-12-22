import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DownloadFile {
  url: string;
  product_name: string;
  version: string;
  product_type?: string;
  description?: string;
  release_notes?: string;
  is_latest?: boolean;
  visibility?: string;
  status?: string;
  catalog_id?: string;
}

interface RequestBody {
  files: DownloadFile[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client for service operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is authenticated and is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user client to verify permissions
    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error('User is not an admin:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json();
    
    if (!body.files || !Array.isArray(body.files) || body.files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request - files array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${body.files.length} file(s) for download addition`);

    const results: { success: any[]; errors: any[] } = { success: [], errors: [] };

    for (const file of body.files) {
      // Validate required fields
      if (!file.url || !file.product_name || !file.version) {
        results.errors.push({
          url: file.url,
          error: 'Missing required fields: url, product_name, and version are required'
        });
        continue;
      }

      // Prepare the download record
      const downloadRecord = {
        file_url: file.url,
        product_name: file.product_name,
        version: file.version,
        product_type: file.product_type || 'software',
        description: file.description || null,
        release_notes: file.release_notes || null,
        is_latest: file.is_latest ?? true,
        visibility: file.visibility || 'public',
        status: file.status || 'released',
        catalog_id: file.catalog_id || null,
        release_date: new Date().toISOString(),
      };

      // If this is marked as latest, unmark previous latest versions
      if (downloadRecord.is_latest) {
        await supabaseAdmin
          .from('product_downloads')
          .update({ is_latest: false })
          .eq('product_name', file.product_name)
          .eq('is_latest', true);
      }

      // Insert the download record
      const { data, error } = await supabaseAdmin
        .from('product_downloads')
        .insert(downloadRecord)
        .select()
        .single();

      if (error) {
        console.error(`Error inserting download for ${file.url}:`, error);
        results.errors.push({
          url: file.url,
          product_name: file.product_name,
          error: error.message
        });
      } else {
        console.log(`Successfully added download: ${file.product_name} v${file.version}`);
        results.success.push({
          id: data.id,
          url: file.url,
          product_name: file.product_name,
          version: file.version
        });
      }
    }

    const statusCode = results.errors.length === 0 ? 200 : 
                       results.success.length === 0 ? 400 : 207;

    return new Response(
      JSON.stringify({
        message: `Processed ${body.files.length} file(s): ${results.success.length} succeeded, ${results.errors.length} failed`,
        results
      }),
      { 
        status: statusCode, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in add-download-urls:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
