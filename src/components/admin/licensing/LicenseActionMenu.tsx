
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Copy, 
  MoreHorizontal, 
  Calendar, 
  PauseCircle
} from "lucide-react";

interface LicenseActionMenuProps {
  licenseKey: string;
  status: string;
  onCopyKey: (key: string) => void;
}

const LicenseActionMenu: React.FC<LicenseActionMenuProps> = ({ 
  licenseKey, 
  status, 
  onCopyKey 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onCopyKey(licenseKey)}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Key</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Extend License</span>
        </DropdownMenuItem>
        {status === "active" && (
          <DropdownMenuItem>
            <PauseCircle className="mr-2 h-4 w-4" />
            <span>Suspend License</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LicenseActionMenu;
