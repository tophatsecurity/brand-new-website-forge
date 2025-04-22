
/**
 * Add admin@tophatsecurity.com as an admin user to Supabase.
 * 
 * Instructions: 
 * 1. Replace SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY with 
 *    your project's values from your Supabase dashboard.
 *    - DO NOT USE the anon/public key! Use the "service_role" key only.
 * 2. Run with: `ts-node add-admin-user.ts`
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://your-supabase-url.supabase.co"; // <-- CHANGE THIS
const SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key";    // <-- CHANGE THIS

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const email = "admin@tophatsecurity.com";
  const password = "Fr33bas3!";
  const user_metadata = {
    role: "admin",
    approved: true
  };

  // Check if user exists
  const { data: userData, error: getUserError } = await supabase.auth.admin.listUsers({ email });
  if (getUserError) {
    console.error("Error searching for user:", getUserError.message);
    return;
  }
  const found = userData.users?.find(u => u.email === email);
  if (found) {
    // Optionally update metadata if user already exists
    const { error: updateError } = await supabase.auth.admin.updateUserById(found.id, {
      user_metadata
    });
    if (updateError) {
      console.error("Admin user already exists, but failed to update metadata:", updateError.message);
    } else {
      console.log("Admin user already exists. Updated metadata.");
    }
    return;
  }

  // Create the user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata
  });

  if (error) {
    console.error("Error creating admin user:", error.message);
  } else {
    console.log("Admin user created!", data.user?.email);
  }
}

main();

