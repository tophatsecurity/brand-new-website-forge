import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Tag,
  Calendar,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { CRMContact, CRMAccount } from '@/hooks/useCRM';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface ContactDetailDialogProps {
  contact: CRMContact | null;
  accounts: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDetailDialog = ({ contact, accounts, open, onOpenChange }: ContactDetailDialogProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile: '',
    job_title: '',
    department: '',
    account_id: '',
    status: 'active',
    lead_source: '',
    is_primary: false,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    notes: '',
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        job_title: contact.job_title || '',
        department: contact.department || '',
        account_id: contact.account_id || '',
        status: contact.status || 'active',
        lead_source: contact.lead_source || '',
        is_primary: contact.is_primary || false,
        address_line1: contact.address_line1 || '',
        address_line2: contact.address_line2 || '',
        city: contact.city || '',
        state: contact.state || '',
        postal_code: contact.postal_code || '',
        country: contact.country || '',
        notes: contact.notes || '',
      });
      setIsEditing(false);
      setActiveTab('details');
    }
  }, [contact]);

  const handleSave = async () => {
    if (!contact) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email || null,
          phone: formData.phone || null,
          mobile: formData.mobile || null,
          job_title: formData.job_title || null,
          department: formData.department || null,
          account_id: formData.account_id || null,
          status: formData.status,
          lead_source: formData.lead_source || null,
          is_primary: formData.is_primary,
          address_line1: formData.address_line1 || null,
          address_line2: formData.address_line2 || null,
          city: formData.city || null,
          state: formData.state || null,
          postal_code: formData.postal_code || null,
          country: formData.country || null,
          notes: formData.notes || null,
        })
        .eq('id', contact.id);

      if (error) throw error;

      toast.success('Contact updated successfully');
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      setIsEditing(false);
    } catch (err: any) {
      toast.error('Failed to update contact: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (contact) {
      setFormData({
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        job_title: contact.job_title || '',
        department: contact.department || '',
        account_id: contact.account_id || '',
        status: contact.status || 'active',
        lead_source: contact.lead_source || '',
        is_primary: contact.is_primary || false,
        address_line1: contact.address_line1 || '',
        address_line2: contact.address_line2 || '',
        city: contact.city || '',
        state: contact.state || '',
        postal_code: contact.postal_code || '',
        country: contact.country || '',
        notes: contact.notes || '',
      });
    }
    setIsEditing(false);
  };

  if (!contact) return null;

  const customFields = contact.custom_fields as Record<string, any> || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {contact.first_name} {contact.last_name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  {contact.job_title && <span>{contact.job_title}</span>}
                  {contact.account?.name && (
                    <>
                      <span>at</span>
                      <span className="font-medium">{contact.account.name}</span>
                    </>
                  )}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="custom">Custom Fields</TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[60vh] mt-4">
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{contact.first_name}</p>
                  )}
                </div>
                <div>
                  <Label>Last Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{contact.last_name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1 flex items-center gap-2">
                      {contact.email ? (
                        <>
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                            {contact.email}
                          </a>
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1 flex items-center gap-2">
                      {contact.phone ? (
                        <>
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                            {contact.phone}
                          </a>
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mobile</Label>
                  {isEditing ? (
                    <Input
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{contact.mobile || '-'}</p>
                  )}
                </div>
                <div>
                  <Label>Account</Label>
                  {isEditing ? (
                    <Select value={formData.account_id} onValueChange={(v) => setFormData({ ...formData, account_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="No account" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="">No account</SelectItem>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm mt-1 flex items-center gap-2">
                      {contact.account?.name ? (
                        <>
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {contact.account.name}
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Title</Label>
                  {isEditing ? (
                    <Input
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1 flex items-center gap-2">
                      {contact.job_title ? (
                        <>
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          {contact.job_title}
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Department</Label>
                  {isEditing ? (
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{contact.department || '-'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  {isEditing ? (
                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                        {contact.status}
                      </Badge>
                    </div>
                  )}
                </div>
                <div>
                  <Label>Lead Source</Label>
                  {isEditing ? (
                    <Input
                      value={formData.lead_source}
                      onChange={(e) => setFormData({ ...formData, lead_source: e.target.value })}
                    />
                  ) : (
                    <div className="mt-1">
                      {contact.lead_source ? (
                        <Badge variant="outline">{contact.lead_source}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>Primary Contact</Label>
                  {isEditing ? (
                    <Switch
                      checked={formData.is_primary}
                      onCheckedChange={(v) => setFormData({ ...formData, is_primary: v })}
                    />
                  ) : (
                    contact.is_primary && <Badge variant="outline">Primary</Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label>Notes</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-sm mt-1 whitespace-pre-wrap">{contact.notes || '-'}</p>
                )}
              </div>

              {contact.tags && contact.tags.length > 0 && (
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contact.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Created: {format(new Date(contact.created_at), 'MMM d, yyyy h:mm a')}
                </div>
                {contact.last_contacted_at && (
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    Last Contacted: {format(new Date(contact.last_contacted_at), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <div>
                <Label>Address Line 1</Label>
                {isEditing ? (
                  <Input
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  />
                ) : (
                  <p className="text-sm mt-1">{contact.address_line1 || '-'}</p>
                )}
              </div>

              <div>
                <Label>Address Line 2</Label>
                {isEditing ? (
                  <Input
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                  />
                ) : (
                  <p className="text-sm mt-1">{contact.address_line2 || '-'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  {isEditing ? (
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{contact.city || '-'}</p>
                  )}
                </div>
                <div>
                  <Label>State</Label>
                  {isEditing ? (
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{contact.state || '-'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Postal Code</Label>
                  {isEditing ? (
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{contact.postal_code || '-'}</p>
                  )}
                </div>
                <div>
                  <Label>Country</Label>
                  {isEditing ? (
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{contact.country || '-'}</p>
                  )}
                </div>
              </div>

              {!isEditing && contact.address_line1 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p>{contact.address_line1}</p>
                      {contact.address_line2 && <p>{contact.address_line2}</p>}
                      <p>
                        {[contact.city, contact.state, contact.postal_code].filter(Boolean).join(', ')}
                      </p>
                      {contact.country && <p>{contact.country}</p>}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              {Object.keys(customFields).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(customFields).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-sm text-muted-foreground">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom fields set
                </p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailDialog;
