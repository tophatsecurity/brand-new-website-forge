
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

// This component is now empty as we've moved the resources to the main navigation
const UserNavMenu = () => {
  const { user } = useAuth();

  // Return null since we've removed the dropdown functionality
  return null;
};

export default UserNavMenu;
