import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Copy, 
  MoreHorizontal, 
  Calendar, 
  PauseCircle,
  Play,
  Eye,
  Pencil,
  Trash2,
  Ban
} from "lucide-react";

interface LicenseActionMenuProps {
  licenseId: string;
  licenseKey: string;
  status: string;
  onCopyKey: (key: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const LicenseActionMenu: React.FC<LicenseActionMenuProps> = ({ 
  licenseId,
  licenseKey, 
  status, 
  onCopyKey,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(licenseId)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCopyKey(licenseKey)}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Key</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onEdit(licenseId)}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit License</span>
        </DropdownMenuItem>
        
        {status !== "active" && (
          <DropdownMenuItem onClick={() => onStatusChange(licenseId, 'active')}>
            <Play className="mr-2 h-4 w-4" />
            <span>Activate License</span>
          </DropdownMenuItem>
        )}
        
        {status === "active" && (
          <DropdownMenuItem onClick={() => onStatusChange(licenseId, 'suspended')}>
            <PauseCircle className="mr-2 h-4 w-4" />
            <span>Suspend License</span>
          </DropdownMenuItem>
        )}
        
        {status !== "revoked" && (
          <DropdownMenuItem onClick={() => onStatusChange(licenseId, 'revoked')}>
            <Ban className="mr-2 h-4 w-4" />
            <span>Revoke License</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(licenseId)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete License</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LicenseActionMenu;
