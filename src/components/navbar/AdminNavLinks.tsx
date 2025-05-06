
import React, { useState, useEffect } from 'react';
import NavLinkGroup from './NavLinkGroup';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminNavLinksProps {
  isAdmin: boolean;
  className?: string;
}

// This component is now deprecated as we're moving all admin links to the Admin Dashboard
const AdminNavLinks: React.FC<AdminNavLinksProps> = ({ isAdmin, className }) => {
  // Return null since we're not using this component anymore
  return null;
};

export default AdminNavLinks;
