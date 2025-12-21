import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, UserCheck, Users, X, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface TeamMember {
  id: string;
  email: string;
  role: string;
}

interface ContactBulkActionsProps {
  selectedIds: string[];
  accounts: { id: string; name: string }[];
  onClearSelection: () => void;
  onDelete: (ids: string[]) => void;
}

const ContactBulkActions = ({ 
  selectedIds, 
  accounts, 
  onClearSelection,
  onDelete 
}: ContactBulkActionsProps) => {
  const queryClient = useQueryClient();
  const [showAssignAccountDialog, setShowAssignAccountDialog] = useState(false);
  const [showAssignOwnerDialog, setShowAssignOwnerDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');
  const [ownerRole, setOwnerRole] = useState<string>('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch team members (VARs and CSRs)
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('role', ['admin', 'customer_rep', 'var']);

        if (error) throw error;

        const userIds = [...new Set(roles?.map(r => r.user_id) || [])];
        
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email')
            .in('id', userIds);

          const members: TeamMember[] = [];
          for (const profile of profiles || []) {
            const userRole = roles?.find(r => r.user_id === profile.id);
            if (profile.email) {
              members.push({
                id: profile.id,
                email: profile.email,
                role: userRole?.role || 'user'
              });
            }
          }
          setTeamMembers(members);
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
      }
    };

    fetchTeamMembers();
  }, []);

  const filteredTeamMembers = teamMembers.filter(m => {
    if (ownerRole === 'all') return true;
    return m.role === ownerRole;
  });

  const handleAssignAccount = async () => {
    if (!selectedAccountId) return;
    
    setIsProcessing(true);
    try {
      const accountId = selectedAccountId === 'none' ? null : selectedAccountId;
      
      const { error } = await supabase
        .from('crm_contacts')
        .update({ account_id: accountId })
        .in('id', selectedIds);

      if (error) throw error;

      toast.success(`Updated ${selectedIds.length} contacts`);
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      setShowAssignAccountDialog(false);
      onClearSelection();
    } catch (err: any) {
      toast.error('Failed to update contacts: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssignOwner = async () => {
    if (!selectedOwnerId) return;
    
    setIsProcessing(true);
    try {
      const ownerId = selectedOwnerId === 'none' ? null : selectedOwnerId;
      
      const { error } = await supabase
        .from('crm_contacts')
        .update({ owner_id: ownerId })
        .in('id', selectedIds);

      if (error) throw error;

      toast.success(`Assigned ${selectedIds.length} contacts`);
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      setShowAssignOwnerDialog(false);
      onClearSelection();
    } catch (err: any) {
      toast.error('Failed to assign contacts: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      toast.success(`Deleted ${selectedIds.length} contacts`);
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      setShowDeleteDialog(false);
      onClearSelection();
    } catch (err: any) {
      toast.error('Failed to delete contacts: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500/10 text-red-600',
      customer_rep: 'bg-blue-500/10 text-blue-600',
      var: 'bg-purple-500/10 text-purple-600',
    };
    const labels: Record<string, string> = {
      admin: 'Admin',
      customer_rep: 'CSR',
      var: 'VAR',
    };
    return (
      <Badge variant="outline" className={colors[role] || ''}>
        {labels[role] || role}
      </Badge>
    );
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <Badge variant="default" className="text-sm">
          {selectedIds.length} selected
        </Badge>
        <div className="flex items-center gap-2 ml-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAssignAccountDialog(true)}
          >
            <Building2 className="h-4 w-4 mr-1" />
            Assign Account
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAssignOwnerDialog(true)}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Assign Owner
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Assign Account Dialog */}
      <Dialog open={showAssignAccountDialog} onOpenChange={setShowAssignAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Account</DialogTitle>
            <DialogDescription>
              Assign {selectedIds.length} contact(s) to an account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Select Account</Label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose an account..." />
              </SelectTrigger>
              <SelectContent className="bg-popover max-h-60">
                <SelectItem value="none">No account (remove assignment)</SelectItem>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignAccountDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignAccount} disabled={!selectedAccountId || isProcessing}>
              {isProcessing ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Owner Dialog */}
      <Dialog open={showAssignOwnerDialog} onOpenChange={setShowAssignOwnerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Owner</DialogTitle>
            <DialogDescription>
              Assign {selectedIds.length} contact(s) to a VAR or Customer Service Rep.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label>Filter by Role</Label>
              <Select value={ownerRole} onValueChange={setOwnerRole}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="var">VAR Only</SelectItem>
                  <SelectItem value="customer_rep">CSR Only</SelectItem>
                  <SelectItem value="admin">Admin Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Owner</Label>
              <Select value={selectedOwnerId} onValueChange={setSelectedOwnerId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose an owner..." />
                </SelectTrigger>
                <SelectContent className="bg-popover max-h-60">
                  <SelectItem value="none">No owner (remove assignment)</SelectItem>
                  {filteredTeamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <span>{member.email}</span>
                        {getRoleBadge(member.role)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignOwnerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignOwner} disabled={!selectedOwnerId || isProcessing}>
              {isProcessing ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contacts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.length} contact(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={isProcessing}>
              {isProcessing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactBulkActions;
