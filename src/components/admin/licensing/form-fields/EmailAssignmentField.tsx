
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EmailAssignmentFieldProps {
  form: any;
}

const EmailAssignmentField: React.FC<EmailAssignmentFieldProps> = ({ form }) => {
  return (
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
  );
};

export default EmailAssignmentField;
