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

    // Verify the user is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: requestingUser }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !requestingUser || requestingUser.user_metadata?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized - Admin only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { action, userId, email, password, metadata, role, banDuration } = await req.json()

    let result

    switch (action) {
      case 'create':
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: metadata || { role: 'user', approved: false }
        })
        if (createError) throw createError
        result = { user: newUser.user, message: 'User created successfully' }
        console.log(`Created user: ${email}`)
        break

      case 'update':
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: metadata
        })
        if (updateError) throw updateError
        result = { message: 'User updated successfully' }
        console.log(`Updated user: ${userId}`)
        break

      case 'delete':
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (deleteError) throw deleteError
        result = { message: 'User deleted successfully' }
        console.log(`Deleted user: ${userId}`)
        break

      case 'ban':
        const banAttrs: any = {}
        if (banDuration === 'forever') {
          banAttrs.ban_duration = '876000h' // ~100 years
        } else if (banDuration === 'none') {
          banAttrs.ban_duration = 'none'
        }
        const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(userId, banAttrs)
        if (banError) throw banError
        result = { message: banDuration === 'none' ? 'User enabled' : 'User disabled' }
        console.log(`${banDuration === 'none' ? 'Enabled' : 'Disabled'} user: ${userId}`)
        break

      case 'updateRole':
        // Update auth metadata
        const { error: roleError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { role }
        })
        if (roleError) throw roleError

        // Get user email for promote function
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId)
        const userEmail = userData.user?.email

        if (role === 'admin' && userEmail) {
          await supabaseAdmin.rpc('promote_to_admin', { user_email: userEmail })
        } else {
          // Remove admin role if demoting
          await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', userId)
            .eq('role', 'admin')
          
          // Ensure user has the new role
          await supabaseAdmin
            .from('user_roles')
            .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' })
        }
        result = { message: `Role updated to ${role}` }
        console.log(`Updated role for ${userId} to ${role}`)
        break

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    return new Response(JSON.stringify(result), {
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
