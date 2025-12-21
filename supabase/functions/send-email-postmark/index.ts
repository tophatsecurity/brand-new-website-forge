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
  template?: string;
  data?: {
    customMessage?: string;
    testMode?: boolean;
    [key: string]: any;
  };
}

// Email templates
const getEmailTemplate = (template: string, data: Record<string, any> = {}): string => {
  const templates: Record<string, string> = {
    welcome: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Top Hat Security!</h1>
        <p>Thank you for joining us. We're excited to have you on board.</p>
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    password_reset: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You have requested to reset your password.</p>
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    notification: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Notification</h1>
        <p>You have a new notification from Top Hat Security.</p>
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    license_expiry: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">License Expiry Notice</h1>
        <p>Your license is approaching its expiry date.</p>
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>Please contact us to renew your license.</p>
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
  };
  
  return templates[template] || templates.welcome;
};

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

    const { to, subject, htmlBody, textBody, from, tag, replyTo, template, data }: EmailRequest = await req.json();

    if (!to || !subject) {
      throw new Error("Missing required fields: 'to' and 'subject' are required");
    }

    // Generate HTML from template if no htmlBody/textBody provided
    let finalHtmlBody = htmlBody;
    let finalTextBody = textBody;
    
    if (!htmlBody && !textBody) {
      if (template) {
        finalHtmlBody = getEmailTemplate(template, data || {});
      } else {
        throw new Error("Either 'htmlBody', 'textBody', or 'template' must be provided");
      }
    }

    console.log(`Sending email to: ${to}, subject: ${subject}`);

    const emailPayload: Record<string, string> = {
      From: from || "noreply@tophatsecurity.com",
      To: to,
      Subject: subject,
    };

    if (finalHtmlBody) {
      emailPayload.HtmlBody = finalHtmlBody;
    }

    if (finalTextBody) {
      emailPayload.TextBody = finalTextBody;
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
