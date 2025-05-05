
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, XCircle } from 'lucide-react';

interface ApprovalActionsProps {
  userId: string;
  onApproveUser: (userId: string) => Promise<void>;
  onRejectUser: (userId: string) => Promise<void>;
}

const ApprovalActions = ({ userId, onApproveUser, onRejectUser }: ApprovalActionsProps) => {
  return (
    <>
      <Button
        variant="default"
        size="sm"
        className="flex items-center"
        onClick={() => onApproveUser(userId)}
      >
        <UserCheck className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="flex items-center"
        onClick={() => onRejectUser(userId)}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </>
  );
};

export default ApprovalActions;
