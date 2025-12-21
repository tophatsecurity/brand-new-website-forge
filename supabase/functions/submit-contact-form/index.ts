import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  productInterest: string;
  message: string;
  createDemoAccount: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const data: ContactFormRequest = await req.json();
    console.log("Processing contact form submission:", { 
      email: data.email, 
      productInterest: data.productInterest,
      createDemoAccount: data.createDemoAccount 
    });

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Create CRM contact using service role (bypasses RLS)
    const { data: contact, error: contactError } = await supabase
      .from("crm_contacts")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        lead_source: "Contact Form",
        notes: `Product Interest: ${data.productInterest}\n\nMessage:\n${data.message}${data.createDemoAccount ? "\n\n[Requested Demo Account]" : ""}`,
        tags: [data.productInterest, "website-inquiry"],
        status: "lead",
      })
      .select()
      .single();

    if (contactError) {
      console.error("Failed to create CRM contact:", contactError);
    } else {
      console.log("Created CRM contact:", contact.id);
    }

    // 2. Send confirmation email to user
    try {
      const { error: userEmailError } = await supabase.functions.invoke("send-email-postmark", {
        body: {
          to: data.email,
          subject: "Thank you for contacting Top Hat Security",
          template: "contact_confirmation",
          data: {
            firstName: data.firstName,
            productInterest: data.productInterest,
            createDemoAccount: data.createDemoAccount,
          },
        },
      });

      if (userEmailError) {
        console.error("User confirmation email failed:", userEmailError);
      } else {
        console.log("User confirmation email sent to:", data.email);
      }
    } catch (emailError) {
      console.error("Error sending user email:", emailError);
    }

    // 3. Send notification to admins
    try {
      const { error: adminEmailError } = await supabase.functions.invoke("send-email-postmark", {
        body: {
          to: "sales@tophatsecurity.com",
          subject: `New Contact Inquiry: ${data.firstName} ${data.lastName} - ${data.productInterest}`,
          template: "contact_admin_notification",
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
            productInterest: data.productInterest,
            message: data.message,
            createDemoAccount: data.createDemoAccount,
            contactId: contact?.id,
          },
        },
      });

      if (adminEmailError) {
        console.error("Admin notification email failed:", adminEmailError);
      } else {
        console.log("Admin notification email sent");
      }
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        contactId: contact?.id,
        message: "Contact form submitted successfully" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to submit contact form" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
