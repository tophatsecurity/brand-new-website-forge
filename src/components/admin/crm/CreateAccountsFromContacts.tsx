import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Building2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ContactWithAccount {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  account_id: string | null;
  custom_fields: any;
  notes: string | null;
}

interface AccountToCreate {
  name: string;
  contacts: ContactWithAccount[];
  industry: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
}

const CreateAccountsFromContacts = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [accountsToCreate, setAccountsToCreate] = useState<AccountToCreate[]>([]);
  const [results, setResults] = useState<{ created: number; linked: number; errors: string[] } | null>(null);

  const scanContacts = async () => {
    setScanning(true);
    setAccountsToCreate([]);
    setResults(null);

    try {
      // Fetch contacts without an account_id
      const { data: contacts, error } = await supabase
        .from('crm_contacts')
        .select('id, first_name, last_name, email, phone, address_line1, city, state, postal_code, country, account_id, custom_fields, notes')
        .is('account_id', null);

      if (error) throw error;

      // Fetch existing accounts to avoid duplicates
      const { data: existingAccounts } = await supabase
        .from('crm_accounts')
        .select('id, name');

      const existingAccountNames = new Set(
        (existingAccounts || []).map(a => a.name.toLowerCase().trim())
      );

      // Group contacts by account name from custom_fields
      const accountMap = new Map<string, AccountToCreate>();

      for (const contact of contacts || []) {
        let accountName: string | null = null;
        const customFields = contact.custom_fields as Record<string, any> | null;

        // Check custom_fields for account_name
        if (customFields?.account_name) {
          accountName = customFields.account_name;
        }
        // Check notes for "Account: X" pattern
        else if (contact.notes) {
          const match = contact.notes.match(/Account:\s*(.+?)(?:\n|$)/i);
          if (match) {
            accountName = match[1].trim();
          }
        }

        if (!accountName) continue;

        const normalizedName = accountName.toLowerCase().trim();

        // Skip if account already exists
        if (existingAccountNames.has(normalizedName)) continue;

        if (!accountMap.has(normalizedName)) {
          accountMap.set(normalizedName, {
            name: accountName.trim(),
            contacts: [],
            industry: customFields?.industry || null,
            address_line1: contact.address_line1,
            city: contact.city,
            state: contact.state,
            postal_code: contact.postal_code,
            country: contact.country,
            phone: contact.phone,
            email: contact.email,
          });
        }

        accountMap.get(normalizedName)!.contacts.push(contact);
      }

      setAccountsToCreate(Array.from(accountMap.values()));
    } catch (err: any) {
      console.error('Error scanning contacts:', err);
      toast.error('Failed to scan contacts');
    } finally {
      setScanning(false);
    }
  };

  const handleCreateAccounts = async () => {
    if (accountsToCreate.length === 0) return;

    setLoading(true);
    const results = { created: 0, linked: 0, errors: [] as string[] };

    for (const account of accountsToCreate) {
      try {
        // Create the account with data from contacts
        const accountData: any = {
          name: account.name,
          account_type: 'prospect',
          status: 'active',
        };

        if (account.industry) accountData.industry = account.industry;
        if (account.address_line1) accountData.address_line1 = account.address_line1;
        if (account.city) accountData.city = account.city;
        if (account.state) accountData.state = account.state;
        if (account.postal_code) accountData.postal_code = account.postal_code;
        if (account.country) accountData.country = account.country;
        if (account.phone) accountData.phone = account.phone;
        if (account.email) accountData.email = account.email;
        accountData.notes = `Auto-created from ${account.contacts.length} existing contact(s)`;

        const { data: newAccount, error: createError } = await supabase
          .from('crm_accounts')
          .insert(accountData)
          .select('id')
          .single();

        if (createError) {
          results.errors.push(`${account.name}: ${createError.message}`);
          continue;
        }

        results.created++;

        // Link all contacts to the new account
        for (const contact of account.contacts) {
          const { error: updateError } = await supabase
            .from('crm_contacts')
            .update({ account_id: newAccount.id })
            .eq('id', contact.id);

          if (updateError) {
            results.errors.push(`Failed to link ${contact.first_name} ${contact.last_name}: ${updateError.message}`);
          } else {
            results.linked++;
          }
        }
      } catch (err: any) {
        results.errors.push(`${account.name}: ${err.message}`);
      }
    }

    setResults(results);
    setLoading(false);

    if (results.created > 0) {
      queryClient.invalidateQueries({ queryKey: ['crm-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success(`Created ${results.created} accounts and linked ${results.linked} contacts`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Building2 className="h-4 w-4 mr-2" />
          Create Accounts from Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Accounts from Existing Contacts</DialogTitle>
          <DialogDescription>
            Scan contacts without accounts, create accounts from their company names, and automatically link them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!results && (
            <Button onClick={scanContacts} disabled={scanning} className="w-full">
              {scanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning contacts...
                </>
              ) : (
                'Scan Contacts for Account Names'
              )}
            </Button>
          )}

          {accountsToCreate.length > 0 && !results && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Accounts to Create</h4>
                <Badge variant="secondary">{accountsToCreate.length} accounts</Badge>
              </div>
              <ScrollArea className="h-[300px] border rounded-md p-3">
                <div className="space-y-3">
                  {accountsToCreate.map((account, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{account.name}</span>
                        <Badge variant="outline">{account.contacts.length} contacts</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                        {account.industry && <div>Industry: {account.industry}</div>}
                        {account.city && account.state && (
                          <div>Location: {account.city}, {account.state}</div>
                        )}
                        {account.country && !account.city && <div>Country: {account.country}</div>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Contacts: {account.contacts.map(c => `${c.first_name} ${c.last_name}`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {accountsToCreate.length === 0 && !scanning && !results && (
            <div className="text-center py-8 text-muted-foreground">
              Click "Scan Contacts" to find contacts with account names that don't have linked accounts yet.
            </div>
          )}

          {results && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  Created {results.created} accounts, linked {results.linked} contacts
                </span>
              </div>
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
        </div>

        <DialogFooter>
          {results ? (
            <Button onClick={() => setOpen(false)}>Close</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateAccounts} 
                disabled={loading || accountsToCreate.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  `Create ${accountsToCreate.length} Accounts`
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountsFromContacts;
