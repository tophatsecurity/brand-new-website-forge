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

    const { action, userId, email, password, metadata, role, banDuration, users, contacts, createLicenses, licenseConfig, sendEmailNotification, loginUrl, userIds } = await req.json()

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

      case 'bulkCreate':
        if (!users || !Array.isArray(users) || users.length === 0) {
          throw new Error('No users provided for bulk creation')
        }

        const results = {
          success: 0,
          failed: 0,
          errors: [] as string[],
          created: [] as any[]
        }

        for (const user of users) {
          try {
            const userRole = user.role || 'user'
            const { data: createdUser, error: bulkCreateError } = await supabaseAdmin.auth.admin.createUser({
              email: user.email,
              password: user.password,
              email_confirm: true,
              user_metadata: { role: userRole, approved: false }
            })

            if (bulkCreateError) {
              results.failed++
              results.errors.push(`${user.email}: ${bulkCreateError.message}`)
              console.error(`Failed to create user ${user.email}:`, bulkCreateError.message)
            } else {
              // Add user role to user_roles table
              if (createdUser.user) {
                await supabaseAdmin
                  .from('user_roles')
                  .upsert({ user_id: createdUser.user.id, role: userRole }, { onConflict: 'user_id,role' })
              }
              
              results.success++
              results.created.push({ email: user.email, id: createdUser.user?.id })
              console.log(`Created user: ${user.email} with role: ${userRole}`)
            }
          } catch (err: any) {
            results.failed++
            results.errors.push(`${user.email}: ${err.message}`)
            console.error(`Error creating user ${user.email}:`, err.message)
          }
        }

        result = results
        console.log(`Bulk create completed: ${results.success} success, ${results.failed} failed`)
        break

      case 'createFromContacts':
        // Create users from CRM contacts with optional licenses
        if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
          throw new Error('No contacts provided')
        }

        const contactResults = {
          usersCreated: 0,
          licensesCreated: 0,
          emailsSent: 0,
          failed: 0,
          errors: [] as string[],
          created: [] as any[]
        }

        for (const contact of contacts) {
          try {
            if (!contact.email) {
              contactResults.failed++
              contactResults.errors.push(`${contact.first_name} ${contact.last_name}: No email address`)
              continue
            }

            // Generate a random password
            const tempPassword = crypto.randomUUID().substring(0, 16) + 'Aa1!'
            const userRole = contact.role || 'customer'

            // Create auth user
            const { data: createdUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
              email: contact.email,
              password: tempPassword,
              email_confirm: true,
              user_metadata: { 
                role: userRole, 
                approved: true,
                first_name: contact.first_name,
                last_name: contact.last_name,
                contact_id: contact.id
              }
            })

            if (createUserError) {
              contactResults.failed++
              contactResults.errors.push(`${contact.email}: ${createUserError.message}`)
              console.error(`Failed to create user for contact ${contact.email}:`, createUserError.message)
              continue
            }

            // Add user role to user_roles table
            if (createdUser.user) {
              await supabaseAdmin
                .from('user_roles')
                .upsert({ user_id: createdUser.user.id, role: userRole }, { onConflict: 'user_id,role' })

              // Update the contact with the user link info
              await supabaseAdmin
                .from('crm_contacts')
                .update({ 
                  custom_fields: { 
                    ...contact.custom_fields,
                    system_user_id: createdUser.user.id,
                    system_user_created_at: new Date().toISOString()
                  }
                })
                .eq('id', contact.id)
            }

            contactResults.usersCreated++
            contactResults.created.push({ 
              email: contact.email, 
              userId: createdUser.user?.id,
              contactId: contact.id,
              tempPassword 
            })
            console.log(`Created user from contact: ${contact.email} with role: ${userRole}`)

            // Send email notification with credentials if requested
            if (sendEmailNotification && createdUser.user) {
              try {
                const emailResponse = await fetch(
                  `${supabaseUrl}/functions/v1/send-email-postmark`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${serviceRoleKey}`,
                    },
                    body: JSON.stringify({
                      to: contact.email,
                      subject: 'Your Top Hat Security Account Has Been Created',
                      template: 'account_credentials',
                      data: {
                        firstName: contact.first_name,
                        email: contact.email,
                        tempPassword: tempPassword,
                        loginUrl: loginUrl || null,
                      },
                    }),
                  }
                )

                if (emailResponse.ok) {
                  contactResults.emailsSent++
                  console.log(`Sent credentials email to: ${contact.email}`)
                } else {
                  const emailError = await emailResponse.json()
                  contactResults.errors.push(`Email to ${contact.email}: ${emailError.error || 'Failed to send'}`)
                  console.error(`Failed to send email to ${contact.email}:`, emailError)
                }
              } catch (emailErr: any) {
                contactResults.errors.push(`Email to ${contact.email}: ${emailErr.message}`)
                console.error(`Error sending email to ${contact.email}:`, emailErr.message)
              }
            }

            // Create license if requested
            if (createLicenses && licenseConfig && createdUser.user) {
              try {
                // Generate license key
                const licenseKey = `LIC-${crypto.randomUUID().substring(0, 8).toUpperCase()}`
                
                // Calculate expiry date
                const expiryDate = new Date()
                expiryDate.setFullYear(expiryDate.getFullYear() + (licenseConfig.years || 1))

                const licenseData = {
                  license_key: licenseKey,
                  product_name: licenseConfig.product_name || 'Default Product',
                  tier_id: licenseConfig.tier_id,
                  assigned_to: contact.email,
                  status: 'active',
                  seats: licenseConfig.seats || 1,
                  expiry_date: expiryDate.toISOString(),
                  account_id: contact.account_id || null,
                  features: licenseConfig.features || [],
                  addons: licenseConfig.addons || []
                }

                const { error: licenseError } = await supabaseAdmin
                  .from('product_licenses')
                  .insert(licenseData)

                if (licenseError) {
                  contactResults.errors.push(`License for ${contact.email}: ${licenseError.message}`)
                  console.error(`Failed to create license for ${contact.email}:`, licenseError.message)
                } else {
                  contactResults.licensesCreated++
                  console.log(`Created license for: ${contact.email}`)
                }
              } catch (licErr: any) {
                contactResults.errors.push(`License for ${contact.email}: ${licErr.message}`)
              }
            }

          } catch (err: any) {
            contactResults.failed++
            contactResults.errors.push(`${contact.email || contact.first_name}: ${err.message}`)
            console.error(`Error processing contact:`, err.message)
          }
        }

        result = contactResults
        console.log(`Create from contacts completed: ${contactResults.usersCreated} users, ${contactResults.licensesCreated} licenses, ${contactResults.emailsSent} emails, ${contactResults.failed} failed`)
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

      case 'updateMetadata':
        // Update user metadata (name, phone, etc.)
        const { data: currentUserData } = await supabaseAdmin.auth.admin.getUserById(userId)
        const existingMetadata = currentUserData?.user?.user_metadata || {}
        
        const updatedMetadata = {
          ...existingMetadata,
          ...metadata,
        }
        
        const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: updatedMetadata
        })
        if (metadataError) throw metadataError
        
        result = { message: 'User metadata updated' }
        console.log(`Updated metadata for ${userId}`)
        break

      case 'bulkUpdateRole':
        // Bulk update roles for multiple users
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
          throw new Error('No user IDs provided for bulk role update')
        }

        const bulkResults = {
          success: 0,
          failed: 0,
          errors: [] as string[]
        }

        for (const uid of userIds) {
          try {
            // Update auth metadata
            const { error: bulkRoleError } = await supabaseAdmin.auth.admin.updateUserById(uid, {
              user_metadata: { role }
            })
            if (bulkRoleError) throw bulkRoleError

            // Get user email for promote function
            const { data: bulkUserData } = await supabaseAdmin.auth.admin.getUserById(uid)
            const bulkUserEmail = bulkUserData.user?.email

            if (role === 'admin' && bulkUserEmail) {
              await supabaseAdmin.rpc('promote_to_admin', { user_email: bulkUserEmail })
            } else {
              // Remove admin role if demoting
              await supabaseAdmin
                .from('user_roles')
                .delete()
                .eq('user_id', uid)
                .eq('role', 'admin')
              
              // Ensure user has the new role
              await supabaseAdmin
                .from('user_roles')
                .upsert({ user_id: uid, role }, { onConflict: 'user_id,role' })
            }

            bulkResults.success++
            console.log(`Updated role for ${uid} to ${role}`)
          } catch (err: any) {
            bulkResults.failed++
            bulkResults.errors.push(`${uid}: ${err.message}`)
            console.error(`Error updating role for ${uid}:`, err.message)
          }
        }

        result = { 
          message: `Updated ${bulkResults.success} users to ${role}`,
          ...bulkResults 
        }
        console.log(`Bulk role update completed: ${bulkResults.success} success, ${bulkResults.failed} failed`)
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
