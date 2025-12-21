
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type LicenseTier } from "@/hooks/useLicenseForm";

interface ProductTierFormFieldsProps {
  form: any;
  tiers: LicenseTier[];
}

const ProductTierFormFields: React.FC<ProductTierFormFieldsProps> = ({ form, tiers }) => {
  return (
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
                <SelectItem value="SEEKCAP">SEEKCAP</SelectItem>
                <SelectItem value="DDX">DDX</SelectItem>
                <SelectItem value="PARAGUARD">PARAGUARD</SelectItem>
                <SelectItem value="SECONDLOOK">SECONDLOOK</SelectItem>
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
  );
};

export default ProductTierFormFields;
