
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserActionsProps {
  user: any;
  onApproveUser: (userId: string) => Promise<void>;
}

const UserActions = ({ user, onApproveUser }: UserActionsProps) => {
  if (user.user_metadata?.approved) {
    return null;
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => onApproveUser(user.id)}
    >
      Approve
    </Button>
  );
};

export default UserActions;

