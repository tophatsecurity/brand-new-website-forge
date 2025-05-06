
import React from 'react';
import { Shield } from "lucide-react";

const PermissionsHeader = () => {
  return (
    <div className="flex items-center mb-8">
      <Shield className="mr-2 h-6 w-6" />
      <h1 className="text-3xl font-bold">Permission Management</h1>
    </div>
  );
};

export default PermissionsHeader;
