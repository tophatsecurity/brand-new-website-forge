import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { Save, Loader2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/date-picker";
import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { productFeatures, productAddons, productOptions } from "./license-data/productOptions";

type License = {
  id: string;
  license_key: string;
  product_name: string;
  tier_id?: string;
  tier: { name: string };
  assigned_to: string | null;
  expiry_date: string;
  status: string;
  seats: number;
  features: string[];
  addons: string[];
  max_hosts: number | null;
  allowed_networks: string[];
  concurrent_sessions: number;
  usage_hours_limit: number | null;
};

type LicenseTier = {
  id: string;
  name: string;
  description: string;
  max_seats: number;
};

interface EditLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: License | null;
  tiers: LicenseTier[];
  onSave: (id: string, data: any) => Promise<void>;
  isSubmitting: boolean;
}

const EditLicenseDialog: React.FC<EditLicenseDialogProps> = ({
  open,
  onOpenChange,
  license,
  tiers,
  onSave,
  isSubmitting
}) => {
  const form = useForm({
    defaultValues: {
      product: '',
      tier_id: '',
      seats: 1,
      expiryDate: new Date(),
      email: '',
      status: 'active',
      features: [] as string[],
      addons: [] as string[],
      maxHosts: null as number | null,
      allowedNetworks: '',
      usageHoursLimit: null as number | null,
      concurrentSessions: 1,
    },
  });

  useEffect(() => {
    if (license) {
      form.reset({
        product: license.product_name,
        tier_id: license.tier_id,
        seats: license.seats,
        expiryDate: new Date(license.expiry_date),
        email: license.assigned_to || '',
        status: license.status,
        features: license.features || [],
        addons: license.addons || [],
        maxHosts: license.max_hosts,
        allowedNetworks: license.allowed_networks?.join(', ') || '',
        usageHoursLimit: license.usage_hours_limit,
        concurrentSessions: license.concurrent_sessions || 1,
      });
    }
  }, [license, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!license) return;
    
    const networksArray = data.allowedNetworks
      ? data.allowedNetworks.split(',').map(n => n.trim()).filter(n => n)
      : [];

    await onSave(license.id, {
      product_name: data.product,
      tier_id: data.tier_id,
      seats: data.seats,
      expiry_date: data.expiryDate.toISOString(),
      assigned_to: data.email || null,
      status: data.status,
      features: data.features,
      addons: data.addons,
      max_hosts: data.maxHosts || null,
      allowed_networks: networksArray,
      usage_hours_limit: data.usageHoursLimit || null,
      concurrent_sessions: data.concurrentSessions || 1,
    });
  });

  const featureOptions = productFeatures.map(f => ({ label: f.label, value: f.value }));
  const addonOptions = productAddons.map(a => ({ label: a.label, value: a.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit License</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={form.watch('product')}
                onValueChange={(value) => form.setValue('product', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map((product) => (
                    <SelectItem key={product.value} value={product.value}>
                      {product.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tier</Label>
              <Select
                value={form.watch('tier_id')}
                onValueChange={(value) => form.setValue('tier_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map((tier) => (
                    <SelectItem key={tier.id} value={tier.id}>
                      {tier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Seats</Label>
              <Input
                type="number"
                min={1}
                {...form.register('seats', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('expiryDate') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('expiryDate') ? format(form.watch('expiryDate'), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('expiryDate')}
                    onSelect={(date) => date && form.setValue('expiryDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Assigned To (Email)</Label>
              <Input
                type="email"
                placeholder="user@example.com"
                {...form.register('email')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <MultiSelect
              options={featureOptions}
              selected={form.watch('features')}
              onChange={(values) => form.setValue('features', values)}
              placeholder="Select features"
            />
          </div>

          <div className="space-y-2">
            <Label>Add-ons</Label>
            <MultiSelect
              options={addonOptions}
              selected={form.watch('addons')}
              onChange={(values) => form.setValue('addons', values)}
              placeholder="Select add-ons"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Max Hosts</Label>
              <Input
                type="number"
                min={0}
                {...form.register('maxHosts', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Concurrent Sessions</Label>
              <Input
                type="number"
                min={1}
                {...form.register('concurrentSessions', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Usage Hours Limit</Label>
              <Input
                type="number"
                min={0}
                {...form.register('usageHoursLimit', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allowed Networks (comma-separated)</Label>
            <Input
              placeholder="192.168.1.0/24, 10.0.0.0/8"
              {...form.register('allowedNetworks')}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLicenseDialog;
