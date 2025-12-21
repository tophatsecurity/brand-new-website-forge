import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const { action, ...params } = await req.json();
    console.log(`Stripe action: ${action}`, params);

    switch (action) {
      case 'create-customer': {
        const { email, name, metadata } = params;
        
        // Check if customer already exists
        const existingCustomers = await stripe.customers.list({
          email,
          limit: 1
        });

        let customer;
        if (existingCustomers.data.length > 0) {
          customer = existingCustomers.data[0];
          console.log(`Found existing customer: ${customer.id}`);
        } else {
          customer = await stripe.customers.create({
            email,
            name,
            metadata: metadata || {}
          });
          console.log(`Created new customer: ${customer.id}`);
        }

        return new Response(
          JSON.stringify({ customer }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create-setup-intent': {
        const { customer_id } = params;
        
        const setupIntent = await stripe.setupIntents.create({
          customer: customer_id,
          payment_method_types: ['card'],
          usage: 'off_session',
        });
        
        console.log(`Created setup intent: ${setupIntent.id}`);

        return new Response(
          JSON.stringify({ 
            clientSecret: setupIntent.client_secret,
            setupIntentId: setupIntent.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'confirm-payment-method': {
        const { customer_id, payment_method_id, set_default } = params;

        // Attach payment method to customer
        await stripe.paymentMethods.attach(payment_method_id, {
          customer: customer_id,
        });

        if (set_default) {
          // Set as default payment method
          await stripe.customers.update(customer_id, {
            invoice_settings: {
              default_payment_method: payment_method_id,
            },
          });
        }

        // Get payment method details
        const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);
        
        console.log(`Confirmed payment method: ${payment_method_id} for customer: ${customer_id}`);

        return new Response(
          JSON.stringify({ 
            success: true,
            paymentMethod: {
              id: paymentMethod.id,
              brand: paymentMethod.card?.brand,
              last4: paymentMethod.card?.last4,
              expMonth: paymentMethod.card?.exp_month,
              expYear: paymentMethod.card?.exp_year,
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-customer-payment-methods': {
        const { customer_id } = params;

        const paymentMethods = await stripe.paymentMethods.list({
          customer: customer_id,
          type: 'card',
        });

        return new Response(
          JSON.stringify({ 
            paymentMethods: paymentMethods.data.map(pm => ({
              id: pm.id,
              brand: pm.card?.brand,
              last4: pm.card?.last4,
              expMonth: pm.card?.exp_month,
              expYear: pm.card?.exp_year,
            }))
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-customer': {
        const { customer_id } = params;
        
        const customer = await stripe.customers.retrieve(customer_id);
        
        return new Response(
          JSON.stringify({ customer }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Stripe payment error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
