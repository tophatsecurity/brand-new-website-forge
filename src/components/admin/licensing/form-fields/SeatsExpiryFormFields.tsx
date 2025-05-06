
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/calendar";

interface SeatsExpiryFormFieldsProps {
  form: any;
}

const SeatsExpiryFormFields: React.FC<SeatsExpiryFormFieldsProps> = ({ form }) => {
  return (
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
  );
};

export default SeatsExpiryFormFields;
