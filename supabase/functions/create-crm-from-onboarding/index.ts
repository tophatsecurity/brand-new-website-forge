import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { onboarding_id, user_id } = await req.json();

    if (!onboarding_id) {
      throw new Error('onboarding_id is required');
    }

    console.log(`Creating CRM records for onboarding: ${onboarding_id}`);

    // Fetch the onboarding record with steps
    const { data: onboarding, error: onboardingError } = await supabase
      .from('customer_onboarding')
      .select('*')
      .eq('id', onboarding_id)
      .single();

    if (onboardingError || !onboarding) {
      throw new Error(`Onboarding not found: ${onboardingError?.message}`);
    }

    // Fetch onboarding steps to get additional data
    const { data: steps } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('onboarding_id', onboarding_id)
      .order('step_number');

    // Extract data from steps
    const step1Data = steps?.find(s => s.step_number === 1)?.data || {};
    const step2Data = steps?.find(s => s.step_number === 2)?.data || {};

    // Check if account already exists for this onboarding
    if (onboarding.account_id) {
      console.log(`Account already exists: ${onboarding.account_id}`);
      
      // Fetch existing account and contact
      const { data: existingAccount } = await supabase
        .from('crm_accounts')
        .select('*')
        .eq('id', onboarding.account_id)
        .single();

      const { data: existingContact } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('account_id', onboarding.account_id)
        .eq('is_primary', true)
        .maybeSingle();

      return new Response(
        JSON.stringify({ 
          success: true, 
          account: existingAccount, 
          contact: existingContact,
          message: 'CRM records already exist'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create CRM Account
    const { data: account, error: accountError } = await supabase
      .from('crm_accounts')
      .insert({
        name: onboarding.company_name || `${onboarding.contact_name}'s Company`,
        email: onboarding.contact_email,
        phone: onboarding.contact_phone,
        account_type: 'free', // Start as free tier
        status: 'active',
        industry: step2Data.industry || null,
        notes: `Created from onboarding on ${new Date().toISOString()}`,
        custom_fields: {
          company_size: step2Data.company_size,
          products_interested: steps?.find(s => s.step_number === 3)?.data?.products || [],
          onboarding_id: onboarding_id,
          user_id: user_id || onboarding.user_id
        }
      })
      .select()
      .single();

    if (accountError) {
      throw new Error(`Failed to create account: ${accountError.message}`);
    }

    console.log(`Created account: ${account.id}`);

    // Parse contact name
    const contactName = onboarding.contact_name || '';
    const nameParts = contactName.trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create CRM Contact
    const { data: contact, error: contactError } = await supabase
      .from('crm_contacts')
      .insert({
        account_id: account.id,
        first_name: firstName,
        last_name: lastName,
        email: onboarding.contact_email,
        phone: onboarding.contact_phone,
        job_title: step1Data.job_title || null,
        is_primary: true,
        status: 'active',
        notes: `Primary contact created from onboarding`
      })
      .select()
      .single();

    if (contactError) {
      console.error(`Failed to create contact: ${contactError.message}`);
      // Don't throw - account is more important
    }

    console.log(`Created contact: ${contact?.id}`);

    // Link account to onboarding
    const { error: updateError } = await supabase
      .from('customer_onboarding')
      .update({ account_id: account.id })
      .eq('id', onboarding_id);

    if (updateError) {
      console.error(`Failed to link account to onboarding: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        account, 
        contact,
        message: 'CRM records created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating CRM records:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
