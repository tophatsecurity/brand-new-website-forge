
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DisableUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userEmail: string;
  isDisabled: boolean;
}

const DisableUserDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  userEmail,
  isDisabled 
}: DisableUserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDisabled ? 'Enable User' : 'Disable User'}
          </DialogTitle>
          <DialogDescription>
            {isDisabled 
              ? `Are you sure you want to enable ${userEmail}?` 
              : `Are you sure you want to disable ${userEmail}? This will prevent them from logging in.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant={isDisabled ? "default" : "destructive"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {isDisabled ? 'Enable' : 'Disable'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisableUserDialog;
