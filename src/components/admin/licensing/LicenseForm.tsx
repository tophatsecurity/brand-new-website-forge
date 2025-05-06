
import React from 'react';
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DialogFooter,
} from "@/components/ui/dialog";
import { useLicenseForm, type LicenseTier } from "@/hooks/useLicenseForm";
import { MultiSelect, type Option } from "@/components/ui/multi-select";

// Product features for multi-select
const productFeatures: Option[] = [
  { value: "api_access", label: "API Access" },
  { value: "advanced_reporting", label: "Advanced Reporting" },
  { value: "data_export", label: "Data Export" },
  { value: "real_time_alerts", label: "Real-time Alerts" },
  { value: "custom_dashboards", label: "Custom Dashboards" },
];

// Product addons for multi-select
const productAddons: Option[] = [
  { value: "premium_support", label: "Premium Support" },
  { value: "training", label: "Training Sessions" },
  { value: "custom_integration", label: "Custom Integration" },
  { value: "extended_storage", label: "Extended Storage" },
  { value: "ai_features", label: "AI Features" },
];

type LicenseFormProps = {
  tiers: LicenseTier[];
  onLicenseCreated: (newLicense: any) => void;
  onClose: () => void;
};

const LicenseForm: React.FC<LicenseFormProps> = ({ tiers, onLicenseCreated, onClose }) => {
  const { form, onSubmit, isSubmitting } = useLicenseForm({
    tiers,
    products: [
      { value: "SeekCap", label: "SeekCap" },
      { value: "DDX", label: "DDX" },
      { value: "ParaGuard", label: "ParaGuard" },
      { value: "SecondLook", label: "SecondLook" },
    ],
    features: productFeatures,
    addons: productAddons,
    onLicenseCreated,
    onClose
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SeekCap">SeekCap</SelectItem>
                    <SelectItem value="DDX">DDX</SelectItem>
                    <SelectItem value="ParaGuard">ParaGuard</SelectItem>
                    <SelectItem value="SecondLook">SecondLook</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Tier</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiers.map(tier => (
                      <SelectItem key={tier.id} value={tier.name}>
                        {tier.name} ({tier.max_seats} seats)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="seats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seats</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormDescription>
                  Number of allowed users
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <DatePicker 
                    date={field.value} 
                    onSelect={field.onChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Features Multi-Select */}
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <FormControl>
                <MultiSelect
                  options={productFeatures}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select features"
                />
              </FormControl>
              <FormDescription>
                Select product features to include in this license
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add-ons Multi-Select */}
        <FormField
          control={form.control}
          name="addons"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add-ons</FormLabel>
              <FormControl>
                <MultiSelect
                  options={productAddons}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select add-ons"
                />
              </FormControl>
              <FormDescription>
                Select additional add-ons for this license
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Email address" {...field} />
              </FormControl>
              <FormDescription>
                Leave blank to create an unassigned license
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Key className="mr-2 h-4 w-4" />
            Generate License Key
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LicenseForm;
