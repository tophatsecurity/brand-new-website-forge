import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface ParsedContact {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  department: string | null;
  account_name: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  industry: string | null;
  job_level: string | null;
  lead_source: string | null;
  interaction_type: string | null;
  interaction_date: string | null;
  assigned_rep: string | null;
  valid: boolean;
  error?: string;
}

interface TeamMember {
  id: string;
  email: string;
  role: string;
}

interface BulkContactImportDialogProps {
  accounts: { id: string; name: string }[];
}

const BulkContactImportDialog = ({ accounts }: BulkContactImportDialogProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [leadSource, setLeadSource] = useState<string>('Black Hat 2022');
  const [defaultOwnerId, setDefaultOwnerId] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [accountType, setAccountType] = useState<string>('prospect');
  const [contactStatus, setContactStatus] = useState<string>('active');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [lastTouchPointDate, setLastTouchPointDate] = useState<string>('');
  const [defaultCountry, setDefaultCountry] = useState<string>('');
  const [defaultIndustry, setDefaultIndustry] = useState<string>('');
  const [defaultDepartment, setDefaultDepartment] = useState<string>('');
  const [interactionType, setInteractionType] = useState<string>('');
  const [priority, setPriority] = useState<string>('medium');
  const [isPrimaryContact, setIsPrimaryContact] = useState<boolean>(false);
  const [customLeadSource, setCustomLeadSource] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [createAccountsFromCompany, setCreateAccountsFromCompany] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[]; accountsCreated: number } | null>(null);
  const [createdAccountsCache, setCreatedAccountsCache] = useState<Map<string, string>>(new Map());

  // Fetch team members (users with customer_rep, var, admin roles)
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('role', ['admin', 'customer_rep', 'var']);

        if (error) throw error;

        // Get unique user IDs
        const userIds = [...new Set(roles?.map(r => r.user_id) || [])];
        
        if (userIds.length > 0) {
          // Fetch user emails from profiles
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

    if (open) {
      fetchTeamMembers();
    }
  }, [open]);

  // Parse CSV content - handles the specific Black Hat format
  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    const contacts: ParsedContact[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quoted fields with commas
      const parts: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current.trim());

      // Skip header row if it looks like one
      if (parts[0]?.toLowerCase() === 'first' || parts[0]?.toLowerCase() === 'first_name' || parts[0]?.toLowerCase() === 'firstname') {
        continue;
      }

      // Map Black Hat CSV format (all columns):
      // 0: First Name, 1: Last Name, 2: Title, 3: Account/Company, 4: Email, 5: empty, 6: Phone
      // 7-8: empty, 9: Address, 10: Postal Code, 11: City, 12: Country, 13: State
      // 14-18: empty, 19: Industry, 20: Job Level, 21: Country (duplicate)
      // 22: empty, 23: Interaction Type (Request/Badge scanning), 24-26: empty
      // 27: Interaction Date, 28: empty, 29: Assigned Rep
      const first_name = parts[0] || '';
      const last_name = parts[1] || '';
      const job_title = parts[2] || null;
      const account_name = parts[3] || null;
      const email = parts[4] || null;
      const phone = parts[6] || null;
      const address_line1 = parts[9] || null;
      const postal_code = parts[10] || null;
      const city = parts[11] || null;
      const country = parts[12] || null;
      const state = parts[13] || null;
      const industry = parts[19] || null;
      const job_level = parts[20] || null;
      const interaction_type = parts[23] || null;
      const interaction_date = parts[27] || null;
      const assigned_rep = parts[29] || null;

      // Validation
      let valid = true;
      let error = '';

      if (!first_name || !last_name) {
        valid = false;
        error = 'First and last name required';
      }

      contacts.push({
        first_name,
        last_name,
        email,
        phone,
        job_title,
        department: null,
        account_name,
        address_line1,
        city,
        state,
        postal_code,
        country,
        industry,
        job_level,
        lead_source: leadSource,
        interaction_type,
        interaction_date,
        assigned_rep,
        valid,
        error,
      });
    }

    setParsedContacts(contacts);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
        parseCSV(content);
      };
      reader.readAsText(file);
    }
  };

  const handleTextChange = (value: string) => {
    setCsvContent(value);
    if (value.trim()) {
      parseCSV(value);
    } else {
      setParsedContacts([]);
    }
  };

  const downloadTemplate = () => {
    const template = 'First Name,Last Name,Title,Company,Email,,Phone,,,Address,Postal Code,City,Country,State,,,,,,,Industry,Job Level,,,Interaction Type,,,,Date,,Assigned Rep\nJohn,Doe,Senior Engineer,Acme Corp,john@acme.com,,+1 555-1234,,,123 Main St,12345,New York,United States of America,New York,,,,,,,Technology,Manager,,,,Request,,,,1-1-24 12:00 PM,,Sales Rep';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper function to create or get existing account from company name, populated with contact data
  const getOrCreateAccount = async (companyName: string, contact: ParsedContact): Promise<string | null> => {
    if (!companyName || !createAccountsFromCompany) return null;

    const normalizedName = companyName.trim().toLowerCase();
    
    // Check cache first
    if (createdAccountsCache.has(normalizedName)) {
      return createdAccountsCache.get(normalizedName) || null;
    }

    // Check if account already exists in passed accounts
    const existingAccount = accounts.find(a => a.name.toLowerCase() === normalizedName);
    if (existingAccount) {
      createdAccountsCache.set(normalizedName, existingAccount.id);
      return existingAccount.id;
    }

    // Check if account exists in database
    const { data: existingDbAccount } = await supabase
      .from('crm_accounts')
      .select('id')
      .ilike('name', companyName.trim())
      .maybeSingle();

    if (existingDbAccount) {
      createdAccountsCache.set(normalizedName, existingDbAccount.id);
      return existingDbAccount.id;
    }

    // Create new account populated with contact data
    const accountData: any = {
      name: companyName.trim(),
      account_type: accountType === 'customer' ? 'customer' : 'prospect',
      status: 'active',
    };

    // Populate account fields from contact data
    if (contact.industry || defaultIndustry) accountData.industry = defaultIndustry || contact.industry;
    if (contact.country || defaultCountry) accountData.country = defaultCountry || contact.country;
    if (contact.city) accountData.city = contact.city;
    if (contact.state) accountData.state = contact.state;
    if (contact.postal_code) accountData.postal_code = contact.postal_code;
    if (contact.address_line1) accountData.address_line1 = contact.address_line1;
    if (contact.phone) accountData.phone = contact.phone;
    if (contact.email) accountData.email = contact.email;
    
    // Add tags and notes
    accountData.tags = [(customLeadSource || leadSource).replace(/\s+/g, '-').toLowerCase()];
    accountData.notes = `Auto-created from contact import (${customLeadSource || leadSource})`;

    // Assign owner if specified
    if (defaultOwnerId && defaultOwnerId !== 'none') {
      accountData.owner_id = defaultOwnerId;
    }

    const { data: newAccount, error } = await supabase
      .from('crm_accounts')
      .insert(accountData)
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create account:', error);
      return null;
    }

    createdAccountsCache.set(normalizedName, newAccount.id);
    return newAccount.id;
  };

  const handleSubmit = async () => {
    const validContacts = parsedContacts.filter(c => c.valid);

    if (validContacts.length === 0) {
      return;
    }

    setIsProcessing(true);
    setResults(null);
    setCreatedAccountsCache(new Map());

    const importResults = { success: 0, failed: 0, errors: [] as string[], accountsCreated: 0 };
    const initialAccountCacheSize = createdAccountsCache.size;

    for (const contact of validContacts) {
      try {
        // Build custom fields with extra data
        const customFields: Record<string, any> = {};
        if (contact.account_name) customFields.account_name = contact.account_name;
        if (contact.industry) customFields.industry = contact.industry;
        if (contact.job_level) customFields.job_level = contact.job_level;
        if (contact.interaction_type) customFields.interaction_type = contact.interaction_type;
        if (contact.interaction_date) customFields.interaction_date = contact.interaction_date;
        if (contact.assigned_rep) customFields.original_assigned_rep = contact.assigned_rep;

        // Build notes with comprehensive info
        const notesParts: string[] = [];
        if (contact.account_name) notesParts.push(`Account: ${contact.account_name}`);
        if (contact.industry) notesParts.push(`Industry: ${contact.industry}`);
        if (contact.job_level) notesParts.push(`Job Level: ${contact.job_level}`);
        if (contact.interaction_type) notesParts.push(`Interaction: ${contact.interaction_type}`);
        if (contact.interaction_date) notesParts.push(`Date: ${contact.interaction_date}`);
        if (contact.assigned_rep) notesParts.push(`Original Rep: ${contact.assigned_rep}`);

        // Build final notes
        const allNotes = notesParts.length > 0 ? notesParts.join('\n') : '';
        const finalNotes = notes ? (allNotes ? `${notes}\n\n${allNotes}` : notes) : allNotes;

        // Determine account ID - either from selection, auto-created, or none
        let accountId: string | null = null;
        if (selectedAccountId && selectedAccountId !== 'none') {
          accountId = selectedAccountId;
        } else if (createAccountsFromCompany && contact.account_name) {
          accountId = await getOrCreateAccount(contact.account_name, contact);
        }

        const contactData: any = {
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          phone: contact.phone,
          job_title: contact.job_title,
          department: defaultDepartment || contact.department,
          address_line1: contact.address_line1,
          city: contact.city,
          state: contact.state,
          postal_code: contact.postal_code,
          country: defaultCountry || contact.country,
          lead_source: customLeadSource || (leadSource === 'Other' ? 'Other' : leadSource),
          status: contactStatus,
          is_primary: isPrimaryContact,
          notes: finalNotes || null,
          custom_fields: {
            ...customFields,
            account_type: accountType,
            priority: priority,
            ...(defaultIndustry && { industry_override: defaultIndustry }),
            ...(interactionType && { interaction_type: interactionType }),
            ...(lastTouchPointDate && { last_touch_point: lastTouchPointDate }),
            ...(defaultOwnerId && defaultOwnerId !== 'none' && { assigned_customer_rep_id: defaultOwnerId }),
          },
          tags: [
            (customLeadSource || leadSource).replace(/\s+/g, '-').toLowerCase(),
            ...selectedTags,
            ...(priority === 'high' ? ['priority-high'] : []),
          ],
          ...(lastTouchPointDate && { last_contacted_at: new Date(lastTouchPointDate).toISOString() }),
        };

        if (accountId) {
          contactData.account_id = accountId;
        }

        if (defaultOwnerId && defaultOwnerId !== 'none') {
          contactData.owner_id = defaultOwnerId;
        }

        const { error } = await supabase
          .from('crm_contacts')
          .insert(contactData);

        if (error) {
          importResults.failed++;
          importResults.errors.push(`${contact.first_name} ${contact.last_name}: ${error.message}`);
        } else {
          importResults.success++;
        }
      } catch (err: any) {
        importResults.failed++;
        importResults.errors.push(`${contact.first_name} ${contact.last_name}: ${err.message}`);
      }
    }

    // Calculate how many accounts were actually created (new entries in cache)
    importResults.accountsCreated = createdAccountsCache.size - initialAccountCacheSize;

    setResults(importResults);
    setIsProcessing(false);

    if (importResults.success > 0) {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['crm-accounts'] });
      
      let successMessage = `Imported ${importResults.success} contacts successfully`;
      if (importResults.accountsCreated > 0) {
        successMessage += ` and created ${importResults.accountsCreated} new accounts`;
      }
      toast.success(successMessage);
      
      if (importResults.failed === 0) {
        setTimeout(() => {
          setCsvContent('');
          setParsedContacts([]);
          setResults(null);
          setCreatedAccountsCache(new Map());
          setOpen(false);
        }, 2000);
      }
    }
  };

  const validCount = parsedContacts.filter(c => c.valid).length;
  const invalidCount = parsedContacts.filter(c => !c.valid).length;

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500/10 text-red-600',
      customer_rep: 'bg-blue-500/10 text-blue-600',
      var: 'bg-purple-500/10 text-purple-600',
    };
    const labels: Record<string, string> = {
      admin: 'Admin',
      customer_rep: 'Customer Service',
      var: 'VAR',
    };
    return (
      <Badge variant="outline" className={colors[role] || ''}>
        {labels[role] || role}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Import Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Import Contacts</DialogTitle>
          <DialogDescription>
            Import contacts from a CSV file. Supports Black Hat badge scan exports with all fields including company, industry, job level, and interaction data.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 py-4 pr-4">
            {/* Options Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Link to Account (optional)</Label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No account selected" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-60">
                    <SelectItem value="none">No account</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lead Source</Label>
                <Select value={leadSource} onValueChange={setLeadSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Black Hat 2022">Black Hat 2022</SelectItem>
                    <SelectItem value="Black Hat 2023">Black Hat 2023</SelectItem>
                    <SelectItem value="Black Hat 2024">Black Hat 2024</SelectItem>
                    <SelectItem value="RSA Conference">RSA Conference</SelectItem>
                    <SelectItem value="DEF CON">DEF CON</SelectItem>
                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options Row 2 - Account Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Contact Status</Label>
                <Select value={contactStatus} onValueChange={setContactStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="nurturing">Nurturing</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options Row 3 - Customer Rep & Last Touch Point */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assign Customer Rep</Label>
                <Select value={defaultOwnerId} onValueChange={setDefaultOwnerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer rep" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-60">
                    <SelectItem value="none">No rep assigned</SelectItem>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <span>{member.email}</span>
                          {getRoleBadge(member.role)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Assign to customer service, VAR, or admin
                </p>
              </div>
              <div>
                <Label>Last Touch Point Date</Label>
                <Input 
                  type="datetime-local" 
                  value={lastTouchPointDate}
                  onChange={(e) => setLastTouchPointDate(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  When was the last interaction with these contacts
                </p>
              </div>
            </div>

            {/* Options Row 4 - Tags Multi-select */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Additional Tags</Label>
                <MultiSelect
                  options={[
                    { label: 'Hot Lead', value: 'hot-lead' },
                    { label: 'Cold Lead', value: 'cold-lead' },
                    { label: 'Follow Up', value: 'follow-up' },
                    { label: 'Demo Requested', value: 'demo-requested' },
                    { label: 'Pricing Sent', value: 'pricing-sent' },
                    { label: 'Decision Maker', value: 'decision-maker' },
                    { label: 'Technical Contact', value: 'technical-contact' },
                    { label: 'VIP', value: 'vip' },
                    { label: 'Enterprise', value: 'enterprise' },
                    { label: 'SMB', value: 'smb' },
                  ]}
                  selected={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Select tags..."
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>

            {/* Options Row 5 - Industry & Department Overrides */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Industry (Override)</Label>
                <Select value={defaultIndustry} onValueChange={setDefaultIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Use from CSV" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-60">
                    <SelectItem value="none">Use from CSV</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Financial Services">Financial Services</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Default Department (Override)</Label>
                <Select value={defaultDepartment} onValueChange={setDefaultDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Use from CSV" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">Use from CSV</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options Row 6 - Country & Interaction Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Country (Override)</Label>
                <Select value={defaultCountry} onValueChange={setDefaultCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Use from CSV" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-60">
                    <SelectItem value="none">Use from CSV</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Interaction Type</Label>
                <Select value={interactionType} onValueChange={setInteractionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Use from CSV" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">Use from CSV</SelectItem>
                    <SelectItem value="Badge Scan">Badge Scan</SelectItem>
                    <SelectItem value="Demo Request">Demo Request</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone Call">Phone Call</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                    <SelectItem value="Download">Download</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options Row 7 - Priority & Primary Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input 
                  type="checkbox" 
                  id="isPrimary"
                  checked={isPrimaryContact}
                  onChange={(e) => setIsPrimaryContact(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="isPrimary" className="cursor-pointer">
                  Mark as Primary Contact
                </Label>
              </div>
            </div>

            {/* Options Row 8 - Account Creation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 pt-6">
                <input 
                  type="checkbox" 
                  id="createAccounts"
                  checked={createAccountsFromCompany}
                  onChange={(e) => setCreateAccountsFromCompany(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                  disabled={!!selectedAccountId && selectedAccountId !== 'none'}
                />
                <Label htmlFor="createAccounts" className="cursor-pointer">
                  Auto-create Accounts from CSV Account names
                </Label>
              </div>
              <div>
                <Label>Custom Lead Source (if "Other" selected)</Label>
                <Input 
                  value={customLeadSource}
                  onChange={(e) => setCustomLeadSource(e.target.value)}
                  placeholder="Enter custom lead source..."
                  disabled={leadSource !== 'Other'}
                />
              </div>
            </div>

            {/* Options Row 9 - Notes */}
            <div>
              <Label>Additional Notes (added to all contacts)</Label>
              <Input 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes to add..."
              />
            </div>

            {/* File Upload */}
            <div>
              <Label>Upload CSV File</Label>
              <div className="mt-1">
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload CSV (Black Hat format supported)</span>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Text Input */}
            <div>
              <Label>Or paste CSV content</Label>
              <Textarea
                placeholder="First Name,Last Name,Title,Company,Email,,Phone..."
                value={csvContent}
                onChange={(e) => handleTextChange(e.target.value)}
                className="h-24 font-mono text-xs"
              />
            </div>

            {/* Preview */}
            {parsedContacts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Preview ({parsedContacts.length} contacts)</Label>
                  <div className="flex gap-2">
                    {validCount > 0 && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {validCount} valid
                      </Badge>
                    )}
                    {invalidCount > 0 && (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        {invalidCount} invalid
                      </Badge>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-48 border rounded-md p-2">
                  <div className="space-y-1">
                    {parsedContacts.map((contact, index) => (
                      <div
                        key={index}
                        className={`text-sm p-2 rounded ${
                          contact.valid ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{contact.first_name} {contact.last_name}</span>
                            {contact.account_name && (
                              <span className="text-muted-foreground ml-2">@ {contact.account_name}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {contact.job_title && (
                              <Badge variant="outline" className="text-xs">
                                {contact.job_title.length > 20 ? contact.job_title.substring(0, 20) + '...' : contact.job_title}
                              </Badge>
                            )}
                            {contact.valid ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                          {contact.email && <span>{contact.email}</span>}
                          {contact.phone && <span>{contact.phone}</span>}
                          {contact.industry && <span className="text-primary">{contact.industry}</span>}
                          {contact.job_level && <span className="text-secondary-foreground">{contact.job_level}</span>}
                        </div>
                        {contact.city && contact.state && (
                          <div className="text-xs text-muted-foreground">
                            {contact.city}, {contact.state} {contact.postal_code}
                          </div>
                        )}
                        {contact.error && (
                          <p className="text-xs text-red-600 mt-1">{contact.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Results */}
            {results && (
              <Alert variant={results.failed === 0 ? 'default' : 'destructive'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {results.success > 0 && (
                    <span className="text-green-600">{results.success} contacts imported successfully. </span>
                  )}
                  {results.accountsCreated > 0 && (
                    <span className="text-blue-600">{results.accountsCreated} new accounts created. </span>
                  )}
                  {results.failed > 0 && (
                    <span className="text-red-600">{results.failed} contacts failed to import.</span>
                  )}
                  {results.errors.length > 0 && (
                    <ul className="mt-2 text-sm list-disc list-inside">
                      {results.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {results.errors.length > 5 && (
                        <li>...and {results.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={validCount === 0 || isProcessing}
          >
            {isProcessing ? 'Importing...' : `Import ${validCount} Contacts`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkContactImportDialog;
