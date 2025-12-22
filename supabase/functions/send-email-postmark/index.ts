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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Welcome to Top Hat Security!</h1>
        <p>Thank you for joining us. We're excited to have you on board.</p>
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    password_reset: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You have requested to reset your password.</p>
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    notification: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Notification</h1>
        <p>You have a new notification from Top Hat Security.</p>
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    license_expiry: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #d97706;">License Expiry Notice</h1>
        <p>Your license is approaching its expiry date.</p>
        ${data.productName ? `<p><strong>Product:</strong> ${data.productName}</p>` : ''}
        ${data.expiryDate ? `<p><strong>Expiry Date:</strong> ${data.expiryDate}</p>` : ''}
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>Please contact us to renew your license.</p>
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    account_verification: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Verify Your Account</h1>
        <p>Please verify your email address to complete your account setup.</p>
        ${data.verificationLink ? `<p style="margin: 20px 0;"><a href="${data.verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a></p>` : ''}
        ${data.verificationCode ? `<p>Or use this verification code: <strong style="font-size: 18px; letter-spacing: 2px;">${data.verificationCode}</strong></p>` : ''}
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    license_renewal: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a;">License Renewal Confirmation</h1>
        <p>Great news! Your license has been successfully renewed.</p>
        ${data.productName ? `<p><strong>Product:</strong> ${data.productName}</p>` : ''}
        ${data.licenseKey ? `<p><strong>License Key:</strong> ${data.licenseKey}</p>` : ''}
        ${data.newExpiryDate ? `<p><strong>New Expiry Date:</strong> ${data.newExpiryDate}</p>` : ''}
        ${data.seats ? `<p><strong>Seats:</strong> ${data.seats}</p>` : ''}
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>Thank you for your continued trust in Top Hat Security.</p>
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    onboarding_complete: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a;">🎉 Onboarding Complete!</h1>
        <p>Congratulations! You have successfully completed your onboarding process.</p>
        ${data.companyName ? `<p><strong>Company:</strong> ${data.companyName}</p>` : ''}
        ${data.completedSteps ? `<p><strong>Completed Steps:</strong> ${data.completedSteps}</p>` : ''}
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">What's Next?</h3>
          <ul style="color: #666;">
            <li>Access your product downloads from your dashboard</li>
            <li>Review our documentation and support resources</li>
            <li>Contact your dedicated account representative for assistance</li>
          </ul>
        </div>
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    account_credentials: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Your Account Has Been Created</h1>
        <p>Hello${data.firstName ? ` ${data.firstName}` : ''},</p>
        <p>An account has been created for you at Top Hat Security. Here are your login credentials:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.email || 'N/A'}</p>
          <p style="margin: 0;"><strong>Temporary Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${data.tempPassword || 'N/A'}</code></p>
        </div>
        <p style="color: #dc2626;"><strong>Important:</strong> Please change your password after your first login.</p>
        ${data.loginUrl ? `<p style="margin: 20px 0;"><a href="${data.loginUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login Now</a></p>` : ''}
        ${data.customMessage ? `<p>${data.customMessage}</p>` : ''}
        ${data.testMode ? '<p style="color: #666; font-style: italic;">(This is a test email)</p>' : ''}
        <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't expect this email, please contact our support team.</p>
        <p>Best regards,<br>The Top Hat Security Team</p>
      </div>
    `,
    contact_confirmation: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Thank You for Contacting Us!</h1>
        <p>Hello ${data.firstName || 'there'},</p>
        <p>We have received your inquiry and appreciate you reaching out to Top Hat Security.</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Product Interest:</strong> ${data.productInterest || 'General Inquiry'}</p>
          ${data.createDemoAccount ? '<p style="margin: 0; color: #16a34a;"><strong>✓ Demo Account Requested</strong></p>' : ''}
        </div>
        <p>Our team will review your message and get back to you within 1-2 business days.</p>
        ${data.createDemoAccount ? `
          <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Demo Account Request</strong></p>
            <p style="margin: 8px 0 0 0; color: #666;">We'll set up your 14-day demo account and send you the credentials separately.</p>
          </div>
        ` : ''}
        <p>In the meantime, feel free to explore our products and resources:</p>
        <ul style="color: #666;">
          <li>Visit our <a href="https://tophatsecurity.com/products" style="color: #2563eb;">Products page</a></li>
          <li>Read our <a href="https://tophatsecurity.com/support" style="color: #2563eb;">Documentation</a></li>
        </ul>
        <p>Best regards,<br>The Top Hat Security Team</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #666; font-size: 12px;">
          Top Hat Security<br>
          1-800-989-5718 | sales@tophatsecurity.com
        </p>
      </div>
    `,
    contact_admin_notification: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">📬 New Contact Form Submission</h1>
        <p>A new inquiry has been submitted through the website contact form.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${data.firstName || ''} ${data.lastName || ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #2563eb;">${data.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${data.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td>
              <td style="padding: 8px 0;">${data.company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Product Interest:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">${data.productInterest || 'General Inquiry'}</td>
            </tr>
          </table>
        </div>

        ${data.createDemoAccount ? `
          <div style="background-color: #dcfce7; border: 1px solid #16a34a; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #16a34a;"><strong>🎯 Demo Account Requested</strong></p>
            <p style="margin: 8px 0 0 0; color: #166534;">This lead has requested a demo account. Please follow up to set up their trial.</p>
          </div>
        ` : ''}

        <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Message</h3>
          <p style="color: #666; white-space: pre-wrap;">${data.message || 'No message provided'}</p>
        </div>

        ${data.contactId ? `
          <p style="margin-top: 20px;">
            <a href="https://tophatsecurity.com/admin/crm" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in CRM</a>
          </p>
          <p style="color: #666; font-size: 12px;">CRM Contact ID: ${data.contactId}</p>
        ` : ''}

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from the Top Hat Security website.
        </p>
      </div>
    `,
    ticket_created: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">🎫 Support Ticket Created</h1>
        <p>Hello ${data.requesterName || 'there'},</p>
        <p>Your support ticket has been successfully created. Our team will review it and get back to you as soon as possible.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Ticket Number:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #2563eb;">${data.ticketNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0;">${data.subject || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
              <td style="padding: 8px 0; text-transform: capitalize;">${data.priority || 'Medium'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Category:</strong></td>
              <td style="padding: 8px 0; text-transform: capitalize;">${data.category || 'General'}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Description</h3>
          <p style="color: #666; white-space: pre-wrap;">${data.description || 'No description provided'}</p>
        </div>

        <p>You can track your ticket status by logging into your account and visiting the Support Tickets section.</p>
        
        <p style="margin-top: 20px;">
          <a href="${data.ticketUrl || 'https://tophatsecurity.com/support/tickets'}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Ticket</a>
        </p>

        <p>Best regards,<br>Top Hat Security Support Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #666; font-size: 12px;">
          Reference: ${data.ticketNumber || 'N/A'} | support@tophatsecurity.com
        </p>
      </div>
    `,
    ticket_updated: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">🔔 Ticket Updated</h1>
        <p>Hello ${data.requesterName || 'there'},</p>
        <p>Your support ticket has been updated.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Ticket Number:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #2563eb;">${data.ticketNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0;">${data.subject || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
              <td style="padding: 8px 0;">
                <span style="background-color: ${data.statusColor || '#3b82f6'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                  ${data.statusLabel || data.status || 'Updated'}
                </span>
              </td>
            </tr>
            ${data.updateType ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Update:</strong></td>
              <td style="padding: 8px 0;">${data.updateType}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        ${data.newComment ? `
        <div style="background-color: #fff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px 0; color: #333;">New Reply from Support:</h4>
          <p style="color: #666; margin: 0; white-space: pre-wrap;">${data.newComment}</p>
        </div>
        ` : ''}

        ${data.resolution ? `
        <div style="background-color: #dcfce7; border: 1px solid #16a34a; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px 0; color: #16a34a;">✓ Resolution:</h4>
          <p style="color: #166534; margin: 0; white-space: pre-wrap;">${data.resolution}</p>
        </div>
        ` : ''}

        <p style="margin-top: 20px;">
          <a href="${data.ticketUrl || 'https://tophatsecurity.com/support/tickets'}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Ticket</a>
        </p>

        <p>Best regards,<br>Top Hat Security Support Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #666; font-size: 12px;">
          Reference: ${data.ticketNumber || 'N/A'} | support@tophatsecurity.com
        </p>
      </div>
    `,
    ticket_admin_notification: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #dc2626;">🎫 New Support Ticket</h1>
        <p>A new support ticket has been submitted and requires attention.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Ticket Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Ticket Number:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #2563eb;">${data.ticketNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0;">${data.subject || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Requester:</strong></td>
              <td style="padding: 8px 0;">${data.requesterName || 'N/A'} (${data.requesterEmail || 'N/A'})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Priority:</strong></td>
              <td style="padding: 8px 0;">
                <span style="background-color: ${data.priorityColor || '#3b82f6'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                  ${data.priority || 'Medium'}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Category:</strong></td>
              <td style="padding: 8px 0; text-transform: capitalize;">${data.category || 'General'}</td>
            </tr>
            ${data.productName ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Product:</strong></td>
              <td style="padding: 8px 0;">${data.productName}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Description</h3>
          <p style="color: #666; white-space: pre-wrap;">${data.description || 'No description provided'}</p>
        </div>

        <p style="margin-top: 20px;">
          <a href="https://tophatsecurity.com/admin/support-tickets" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Admin</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from the Top Hat Security support system.
        </p>
      </div>
    `,
    license_created: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a;">🔑 License Issued</h1>
        <p>Hello ${data.customerName || 'there'},</p>
        <p>Your license has been successfully issued!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Product:</strong></td>
              <td style="padding: 8px 0; font-weight: bold;">${data.productName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>License Key:</strong></td>
              <td style="padding: 8px 0;"><code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${data.licenseKey || 'N/A'}</code></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Tier:</strong></td>
              <td style="padding: 8px 0;">${data.tier || 'Standard'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Seats:</strong></td>
              <td style="padding: 8px 0;">${data.seats || 1}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Expiry Date:</strong></td>
              <td style="padding: 8px 0;">${data.expiryDate || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <p>You can view and manage your licenses in your account dashboard.</p>
        
        <p style="margin-top: 20px;">
          <a href="${data.dashboardUrl || 'https://tophatsecurity.com/licensing'}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View My Licenses</a>
        </p>

        <p>Best regards,<br>Top Hat Security Team</p>
      </div>
    `,
    user_approved: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a;">✅ Account Approved!</h1>
        <p>Hello ${data.userName || 'there'},</p>
        <p>Great news! Your account has been approved and you now have full access to the Top Hat Security platform.</p>
        
        <div style="background-color: #dcfce7; border: 1px solid #16a34a; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #166534;"><strong>What's next?</strong></p>
          <ul style="color: #166534; margin: 10px 0 0 0; padding-left: 20px;">
            <li>Explore available products in the catalog</li>
            <li>Download evaluation versions</li>
            <li>Access support resources</li>
            <li>Submit feature requests</li>
          </ul>
        </div>

        <p style="margin-top: 20px;">
          <a href="${data.loginUrl || 'https://tophatsecurity.com/login'}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login Now</a>
        </p>

        <p>Best regards,<br>Top Hat Security Team</p>
      </div>
    `,
    feature_request_status: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">📋 Feature Request Update</h1>
        <p>Hello ${data.userName || 'there'},</p>
        <p>Your feature request has been updated.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">${data.title || 'Feature Request'}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 100px;"><strong>Status:</strong></td>
              <td style="padding: 8px 0;">
                <span style="background-color: ${data.statusColor || '#3b82f6'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                  ${data.status || 'Updated'}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Product:</strong></td>
              <td style="padding: 8px 0;">${data.productName || 'N/A'}</td>
            </tr>
          </table>
        </div>

        ${data.comment ? `
        <div style="background-color: #fff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #666; white-space: pre-wrap;">${data.comment}</p>
        </div>
        ` : ''}

        <p style="margin-top: 20px;">
          <a href="${data.requestUrl || 'https://tophatsecurity.com/feature-requests'}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Request</a>
        </p>

        <p>Best regards,<br>Top Hat Security Team</p>
      </div>
    `,
    credit_purchase_approved: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a;">💰 Credit Purchase Approved</h1>
        <p>Hello ${data.userName || 'there'},</p>
        <p>Your credit purchase has been approved and credits have been added to your account!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Package:</strong></td>
              <td style="padding: 8px 0; font-weight: bold;">${data.packageName || 'Credits'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Credits Added:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #16a34a;">+${data.creditsAdded || 0}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>New Balance:</strong></td>
              <td style="padding: 8px 0;">${data.newBalance || 0} credits</td>
            </tr>
          </table>
        </div>

        <p style="margin-top: 20px;">
          <a href="${data.creditsUrl || 'https://tophatsecurity.com/credits'}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Credits</a>
        </p>

        <p>Best regards,<br>Top Hat Security Team</p>
      </div>
    `,
    onboarding_status_update: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">🚀 Onboarding Update</h1>
        <p>Hello ${data.contactName || 'there'},</p>
        <p>Your onboarding progress has been updated.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Company:</strong></td>
              <td style="padding: 8px 0; font-weight: bold;">${data.companyName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
              <td style="padding: 8px 0;">
                <span style="background-color: ${data.statusColor || '#3b82f6'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                  ${data.status || 'In Progress'}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Current Step:</strong></td>
              <td style="padding: 8px 0;">${data.currentStep || 1} of ${data.totalSteps || 5}</td>
            </tr>
          </table>
        </div>

        ${data.nextStepDescription ? `
        <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Next Step:</strong></p>
          <p style="margin: 8px 0 0 0; color: #666;">${data.nextStepDescription}</p>
        </div>
        ` : ''}

        <p>Best regards,<br>Top Hat Security Team</p>
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
