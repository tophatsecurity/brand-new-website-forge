
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { MultiSelect, type Option } from "@/components/ui/multi-select";

interface FeatureAddonsFormFieldsProps {
  form: any;
  productFeatures: Option[];
  productAddons: Option[];
}

const FeatureAddonsFormFields: React.FC<FeatureAddonsFormFieldsProps> = ({ 
  form, 
  productFeatures, 
  productAddons 
}) => {
  return (
    <>
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
    </>
  );
};

export default FeatureAddonsFormFields;
