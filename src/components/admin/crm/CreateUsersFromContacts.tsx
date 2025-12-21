import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserPlus, Loader2, CheckCircle, AlertCircle, Key, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CRMContact } from '@/hooks/useCRM';

interface CreateUsersFromContactsProps {
  selectedContacts: CRMContact[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

interface CreatedUser {
  email: string;
  userId: string;
  contactId: string;
  tempPassword: string;
}

const CreateUsersFromContacts = ({ 
  selectedContacts, 
  open, 
  onOpenChange,
  onComplete 
}: CreateUsersFromContactsProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [createLicenses, setCreateLicenses] = useState(false);
  const [userRole, setUserRole] = useState<string>('customer');
  const [licenseTiers, setLicenseTiers] = useState<{ id: string; name: string }[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [seats, setSeats] = useState<number>(1);
  const [licenseYears, setLicenseYears] = useState<number>(1);
  const [results, setResults] = useState<{
    usersCreated: number;
    licensesCreated: number;
    failed: number;
    errors: string[];
    created: CreatedUser[];
  } | null>(null);

  // Fetch license tiers
  useEffect(() => {
    const fetchTiers = async () => {
      const { data } = await supabase
        .from('license_tiers')
        .select('id, name')
        .order('name');
      if (data) {
        setLicenseTiers(data);
        if (data.length > 0) {
          setSelectedTierId(data[0].id);
        }
      }
    };
    if (open) {
      fetchTiers();
    }
  }, [open]);

  // Filter contacts with emails
  const contactsWithEmail = selectedContacts.filter(c => c.email);
  const contactsWithoutEmail = selectedContacts.filter(c => !c.email);

  const handleCreate = async () => {
    if (contactsWithEmail.length === 0) {
      toast.error('No contacts with email addresses');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        'https://saveabkhpaemynlfcgcy.supabase.co/functions/v1/admin-user-actions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({
            action: 'createFromContacts',
            contacts: contactsWithEmail.map(c => ({
              id: c.id,
              email: c.email,
              first_name: c.first_name,
              last_name: c.last_name,
              account_id: c.account_id,
              custom_fields: c.custom_fields,
              role: userRole,
            })),
            createLicenses,
            licenseConfig: createLicenses ? {
              tier_id: selectedTierId,
              product_name: productName || 'Default Product',
              seats,
              years: licenseYears,
            } : null,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create users');
      }

      const data = await response.json();
      setResults(data);

      if (data.usersCreated > 0) {
        queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
        queryClient.invalidateQueries({ queryKey: ['licenses'] });
        
        let message = `Created ${data.usersCreated} users`;
        if (data.licensesCreated > 0) {
          message += ` and ${data.licensesCreated} licenses`;
        }
        toast.success(message);
      }
    } catch (err: any) {
      console.error('Error creating users:', err);
      toast.error(err.message || 'Failed to create users');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!results?.created) return;
    
    const text = results.created
      .map(u => `Email: ${u.email}\nPassword: ${u.tempPassword}\n`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard');
  };

  const handleClose = () => {
    if (results?.usersCreated && results.usersCreated > 0) {
      onComplete();
    }
    setResults(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create System Users from Contacts
          </DialogTitle>
          <DialogDescription>
            Create user accounts for selected contacts. They will receive login credentials.
          </DialogDescription>
        </DialogHeader>

        {!results ? (
          <div className="space-y-4">
            {/* Selected contacts summary */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <span className="font-medium">{contactsWithEmail.length}</span> contacts with email
                {contactsWithoutEmail.length > 0 && (
                  <span className="text-muted-foreground ml-2">
                    ({contactsWithoutEmail.length} without email will be skipped)
                  </span>
                )}
              </div>
            </div>

            {/* User role selection */}
            <div className="space-y-2">
              <Label>User Role</Label>
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="var">VAR</SelectItem>
                  <SelectItem value="customer_rep">Customer Rep</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License creation option */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createLicenses"
                  checked={createLicenses}
                  onCheckedChange={(checked) => setCreateLicenses(checked as boolean)}
                />
                <Label htmlFor="createLicenses" className="flex items-center gap-2 cursor-pointer">
                  <Key className="h-4 w-4" />
                  Also create licenses for each user
                </Label>
              </div>

              {createLicenses && (
                <div className="space-y-4 pl-6 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>License Tier</Label>
                      <Select value={selectedTierId} onValueChange={setSelectedTierId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent>
                          {licenseTiers.map(tier => (
                            <SelectItem key={tier.id} value={tier.id}>
                              {tier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Product name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Seats</Label>
                      <Input
                        type="number"
                        min={1}
                        value={seats}
                        onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>License Duration (Years)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={licenseYears}
                        onChange={(e) => setLicenseYears(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contacts preview */}
            <div className="space-y-2">
              <Label>Contacts to create users for:</Label>
              <ScrollArea className="h-[150px] border rounded-md p-3">
                <div className="space-y-2">
                  {contactsWithEmail.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between text-sm">
                      <span>{contact.first_name} {contact.last_name}</span>
                      <span className="text-muted-foreground">{contact.email}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results summary */}
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Created {results.usersCreated} users
                {results.licensesCreated > 0 && `, ${results.licensesCreated} licenses`}
              </span>
            </div>

            {/* Created users with credentials */}
            {results.created.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>User Credentials (temporary passwords)</Label>
                  <Button variant="outline" size="sm" onClick={copyCredentials}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                </div>
                <ScrollArea className="h-[200px] border rounded-md p-3">
                  <div className="space-y-3">
                    {results.created.map((user, idx) => (
                      <div key={idx} className="p-2 bg-muted/50 rounded text-sm font-mono">
                        <div>Email: {user.email}</div>
                        <div>Password: {user.tempPassword}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Errors */}
            {results.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{results.errors.length} errors</span>
                </div>
                <ScrollArea className="h-[100px] border rounded-md p-2">
                  {results.errors.map((err, idx) => (
                    <div key={idx} className="text-xs text-destructive">{err}</div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {results ? (
            <Button onClick={handleClose}>Close</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={handleCreate} 
                disabled={loading || contactsWithEmail.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  `Create ${contactsWithEmail.length} Users`
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUsersFromContacts;
