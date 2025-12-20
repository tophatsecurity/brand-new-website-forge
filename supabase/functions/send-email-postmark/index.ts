import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  htmlBody?: string;
  textBody?: string;
  from?: string;
  tag?: string;
  replyTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const postmarkApiKey = Deno.env.get("POSTMARK_API_KEY");
    
    if (!postmarkApiKey) {
      console.error("POSTMARK_API_KEY is not configured");
      throw new Error("Email service is not configured");
    }

    const { to, subject, htmlBody, textBody, from, tag, replyTo }: EmailRequest = await req.json();

    if (!to || !subject) {
      throw new Error("Missing required fields: 'to' and 'subject' are required");
    }

    if (!htmlBody && !textBody) {
      throw new Error("Either 'htmlBody' or 'textBody' must be provided");
    }

    console.log(`Sending email to: ${to}, subject: ${subject}`);

    const emailPayload: Record<string, string> = {
      From: from || "noreply@tophatsecurity.com",
      To: to,
      Subject: subject,
    };

    if (htmlBody) {
      emailPayload.HtmlBody = htmlBody;
    }

    if (textBody) {
      emailPayload.TextBody = textBody;
    }

    if (tag) {
      emailPayload.Tag = tag;
    }

    if (replyTo) {
      emailPayload.ReplyTo = replyTo;
    }

    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkApiKey,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Postmark API error:", responseData);
      throw new Error(responseData.Message || "Failed to send email");
    }

    console.log("Email sent successfully:", responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: responseData.MessageID,
        to: responseData.To,
        submittedAt: responseData.SubmittedAt
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email-postmark function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
