import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { email, password, action, role } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Find user by email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) throw listError

    const existingUser = users.users.find(u => u.email === email)

    if (action === 'create' || !existingUser) {
      if (existingUser) {
        // Update existing user password and metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          password: password,
          user_metadata: { approved: true }
        })
        if (updateError) throw updateError
        
        // If admin role requested, promote user
        if (role === 'admin') {
          const { error: promoteError } = await supabaseAdmin.rpc('promote_to_admin', { user_email: email })
          if (promoteError) {
            console.error('Promote error:', promoteError)
          }
        }
        
        console.log(`Updated existing user: ${email}`)
        return new Response(JSON.stringify({ success: true, message: 'User updated', userId: existingUser.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Create new user without role in metadata (let the trigger handle default role)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { approved: true }
      })

      if (createError) throw createError

      // If admin role requested, promote user after creation
      if (role === 'admin') {
        // Small delay to let the trigger complete
        await new Promise(resolve => setTimeout(resolve, 500))
        const { error: promoteError } = await supabaseAdmin.rpc('promote_to_admin', { user_email: email })
        if (promoteError) {
          console.error('Promote error:', promoteError)
        }
      }

      console.log(`Created new user: ${email} with role: ${role}`)
      return new Response(JSON.stringify({ success: true, message: 'User created', userId: newUser.user.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Reset password for existing user
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
      password: password
    })

    if (updateError) throw updateError

    console.log(`Password reset for: ${email}`)
    return new Response(JSON.stringify({ success: true, message: 'Password updated' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
