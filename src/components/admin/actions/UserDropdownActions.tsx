import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Trash2, 
  UserCheck,
  UserX,
  KeyRound,
  UserCog,
  MoreHorizontal,
  Pencil
} from 'lucide-react';

interface UserDropdownActionsProps {
  user: any;
  onResetPassword: () => void;
  onOpenRoleDialog: () => void;
  onOpenDisableDialog: () => void;
  onOpenDeleteDialog: () => void;
  onOpenEditDialog: () => void;
}

const UserDropdownActions = ({
  user,
  onResetPassword,
  onOpenRoleDialog,
  onOpenDisableDialog,
  onOpenDeleteDialog,
  onOpenEditDialog
}: UserDropdownActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onOpenEditDialog}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onOpenRoleDialog}>
          <UserCog className="h-4 w-4 mr-2" />
          Change Role
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onResetPassword}>
          <KeyRound className="h-4 w-4 mr-2" />
          Reset Password
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onOpenDisableDialog}>
          {user.banned_until ? (
            <>
              <UserCheck className="h-4 w-4 mr-2" />
              Enable User
            </>
          ) : (
            <>
              <UserX className="h-4 w-4 mr-2" />
              Disable User
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={onOpenDeleteDialog}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownActions;
