
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, AlertCircle, User } from "lucide-react";

type LicenseStatusFilterProps = {
  activeTab: string;
  onChange: (value: string) => void;
};

const LicenseStatusFilter: React.FC<LicenseStatusFilterProps> = ({ activeTab, onChange }) => {
  return (
    <TabsList>
      <TabsTrigger value="all" className="flex items-center gap-1">
        All
      </TabsTrigger>
      <TabsTrigger value="active" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </TabsTrigger>
      <TabsTrigger value="expiring-soon" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Expiring Soon
      </TabsTrigger>
      <TabsTrigger value="expired" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Expired
      </TabsTrigger>
      <TabsTrigger value="unassigned" className="flex items-center gap-1">
        <User className="h-3 w-3" />
        Unassigned
      </TabsTrigger>
    </TabsList>
  );
};

export default LicenseStatusFilter;
