
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface LicenseKeyCellProps {
  licenseKey: string;
  onCopyKey: (key: string) => void;
}

const LicenseKeyCell: React.FC<LicenseKeyCellProps> = ({ licenseKey, onCopyKey }) => {
  return (
    <div className="flex items-center gap-1">
      {licenseKey}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6"
        onClick={() => onCopyKey(licenseKey)}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default LicenseKeyCell;
