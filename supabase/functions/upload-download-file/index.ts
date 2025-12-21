import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Calculate SHA256 hash of file content
async function calculateSHA256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Initialize Supabase client with user's auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized: Unable to verify user");
    }

    // Check admin role
    const { data: roles } = await supabase.rpc("get_my_roles");
    const isAdmin = roles?.includes("admin");
    if (!isAdmin) {
      throw new Error("Unauthorized: Admin access required");
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const productName = formData.get("product_name") as string;
    const version = formData.get("version") as string;

    if (!file) {
      throw new Error("No file provided");
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Read file content
    const fileBuffer = await file.arrayBuffer();
    const fileSize = file.size;

    // Calculate SHA256 hash
    const sha256Hash = await calculateSHA256(fileBuffer);
    console.log(`Calculated SHA256: ${sha256Hash}`);

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedProductName = (productName || "unknown").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const sanitizedVersion = (version || "1.0.0").replace(/[^a-zA-Z0-9.]/g, "-");
    const fileExtension = file.name.split(".").pop() || "bin";
    const fileName = `${sanitizedProductName}/${sanitizedVersion}/${timestamp}-${sha256Hash.substring(0, 8)}.${fileExtension}`;

    // Upload to Supabase Storage using service role for admin operations
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from("product-downloads")
      .upload(fileName, fileBuffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    console.log("File uploaded successfully:", uploadData.path);

    // Get public URL
    const { data: publicUrlData } = adminSupabase.storage
      .from("product-downloads")
      .getPublicUrl(uploadData.path);

    const fileUrl = publicUrlData.publicUrl;

    return new Response(
      JSON.stringify({
        success: true,
        file_url: fileUrl,
        sha256_hash: sha256Hash,
        file_size: fileSize,
        file_name: file.name,
        storage_path: uploadData.path,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in upload-download-file:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message.includes("Unauthorized") ? 401 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
