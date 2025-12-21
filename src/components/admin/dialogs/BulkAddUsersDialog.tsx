import React, { useState } from 'react';
import { z } from 'zod';
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

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
  role: z.enum(['user', 'admin', 'moderator', 'var', 'customer_rep', 'customer']).optional(),
});

interface ParsedUser {
  email: string;
  password?: string;
  role?: string;
  valid: boolean;
  error?: string;
}

interface BulkAddUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBulkAddUsers: (users: { email: string; password: string; role?: string }[]) => Promise<{ success: number; failed: number; errors: string[] }>;
}

const BulkAddUsersDialog = ({ open, onOpenChange, onBulkAddUsers }: BulkAddUsersDialogProps) => {
  const [csvContent, setCsvContent] = useState('');
  const [parsedUsers, setParsedUsers] = useState<ParsedUser[]>([]);
  const [defaultRole, setDefaultRole] = useState<string>('user');
  const [autoGeneratePasswords, setAutoGeneratePasswords] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    const users: ParsedUser[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.toLowerCase().startsWith('email')) continue; // Skip empty lines and header

      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      const email = parts[0];
      const password = parts[1] || (autoGeneratePasswords ? generatePassword() : '');
      const role = parts[2] || defaultRole;

      try {
        userSchema.parse({ email, password: password || undefined, role: role as any });
        users.push({ email, password, role, valid: true });
      } catch (error: any) {
        const message = error.errors?.[0]?.message || 'Invalid data';
        users.push({ email, password, role, valid: false, error: message });
      }
    }

    setParsedUsers(users);
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
      setParsedUsers([]);
    }
  };

  const downloadTemplate = () => {
    const template = 'email,password,role\nuser1@example.com,Password123!,user\nuser2@example.com,,customer\nuser3@example.com,SecurePass456,var';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_users_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    const validUsers = parsedUsers
      .filter(u => u.valid)
      .map(u => ({
        email: u.email,
        password: u.password || generatePassword(),
        role: u.role || defaultRole,
      }));

    if (validUsers.length === 0) {
      return;
    }

    setIsProcessing(true);
    setResults(null);

    try {
      const result = await onBulkAddUsers(validUsers);
      setResults(result);
      
      if (result.success > 0 && result.failed === 0) {
        // All successful - reset form after delay
        setTimeout(() => {
          setCsvContent('');
          setParsedUsers([]);
          setResults(null);
          onOpenChange(false);
        }, 2000);
      }
    } catch (error: any) {
      setResults({ success: 0, failed: validUsers.length, errors: [error.message] });
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = parsedUsers.filter(u => u.valid).length;
  const invalidCount = parsedUsers.filter(u => !u.valid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Import Users</DialogTitle>
          <DialogDescription>
            Import multiple users at once using CSV format. Each row should contain: email, password (optional), role (optional).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Options Row */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Default Role</Label>
              <Select value={defaultRole} onValueChange={setDefaultRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="var">VAR</SelectItem>
                  <SelectItem value="customer_rep">Customer Rep</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              placeholder="email,password,role&#10;user@example.com,Password123!,user&#10;another@example.com,,customer"
              value={csvContent}
              onChange={(e) => handleTextChange(e.target.value)}
              className="h-32 font-mono text-sm"
            />
          </div>

          {/* Preview */}
          {parsedUsers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Preview ({parsedUsers.length} users)</Label>
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
              <ScrollArea className="h-40 border rounded-md p-2">
                <div className="space-y-1">
                  {parsedUsers.map((user, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded ${
                        user.valid ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{user.email}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                          {user.valid ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      {user.error && (
                        <p className="text-xs text-red-600 mt-1">{user.error}</p>
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
                  <span className="text-green-600">{results.success} users created successfully. </span>
                )}
                {results.failed > 0 && (
                  <span className="text-red-600">{results.failed} users failed to create.</span>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={validCount === 0 || isProcessing}
          >
            {isProcessing ? 'Creating Users...' : `Import ${validCount} Users`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAddUsersDialog;
