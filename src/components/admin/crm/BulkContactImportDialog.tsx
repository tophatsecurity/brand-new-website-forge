import React, { useState } from 'react';
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
import { Users, Upload, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface ParsedContact {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  company: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  industry: string | null;
  lead_source: string | null;
  valid: boolean;
  error?: string;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

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

      // Map Black Hat CSV format:
      // 0: First Name, 1: Last Name, 2: Title, 3: Company, 4: Email, 5: empty, 6: Phone
      // 9: Address, 10: Postal Code, 11: City, 12: Country, 13: State
      // 19: Industry
      const first_name = parts[0] || '';
      const last_name = parts[1] || '';
      const job_title = parts[2] || null;
      const company = parts[3] || null;
      const email = parts[4] || null;
      const phone = parts[6] || null;
      const address_line1 = parts[9] || null;
      const postal_code = parts[10] || null;
      const city = parts[11] || null;
      const country = parts[12] || null;
      const state = parts[13] || null;
      const industry = parts[19] || null;

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
        company,
        address_line1,
        city,
        state,
        postal_code,
        country,
        industry,
        lead_source: leadSource,
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
    const template = 'First Name,Last Name,Title,Company,Email,,Phone,,,Address,Postal Code,City,Country,State,,,,,,,Industry\nJohn,Doe,Engineer,Acme Corp,john@acme.com,,+1 555-1234,,,123 Main St,12345,New York,United States of America,New York,,,,,,,Technology';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    const validContacts = parsedContacts.filter(c => c.valid);

    if (validContacts.length === 0) {
      return;
    }

    setIsProcessing(true);
    setResults(null);

    const importResults = { success: 0, failed: 0, errors: [] as string[] };

    for (const contact of validContacts) {
      try {
        const contactData: any = {
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          phone: contact.phone,
          job_title: contact.job_title,
          address_line1: contact.address_line1,
          city: contact.city,
          state: contact.state,
          postal_code: contact.postal_code,
          country: contact.country,
          lead_source: contact.lead_source,
          status: 'active',
          notes: contact.company ? `Company: ${contact.company}${contact.industry ? `\nIndustry: ${contact.industry}` : ''}` : null,
        };

        if (selectedAccountId) {
          contactData.account_id = selectedAccountId;
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

    setResults(importResults);
    setIsProcessing(false);

    if (importResults.success > 0) {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success(`Imported ${importResults.success} contacts successfully`);
      
      if (importResults.failed === 0) {
        setTimeout(() => {
          setCsvContent('');
          setParsedContacts([]);
          setResults(null);
          setOpen(false);
        }, 2000);
      }
    }
  };

  const validCount = parsedContacts.filter(c => c.valid).length;
  const invalidCount = parsedContacts.filter(c => !c.valid).length;

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
            Import contacts from a CSV file. Supports Black Hat badge scan exports and standard CSV formats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Options Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Link to Account (optional)</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="No account selected" />
                </SelectTrigger>
                <SelectContent className="bg-popover max-h-60">
                  <SelectItem value="">No account</SelectItem>
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
                  <SelectItem value="Trade Show">Trade Show</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div>
            <Label>Upload CSV File</Label>
            <div className="mt-1">
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload CSV</span>
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
                          {contact.company && (
                            <span className="text-muted-foreground ml-2">@ {contact.company}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.job_title && (
                            <Badge variant="outline" className="text-xs">
                              {contact.job_title.length > 25 ? contact.job_title.substring(0, 25) + '...' : contact.job_title}
                            </Badge>
                          )}
                          {contact.valid ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {contact.email && <span className="mr-3">{contact.email}</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                      </div>
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
