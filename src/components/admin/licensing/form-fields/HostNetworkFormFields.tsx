import React from 'react';
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Server, Network, Clock, Users } from "lucide-react";

type FormValues = {
  maxHosts: number | null;
  allowedNetworks: string;
  usageHoursLimit: number | null;
  concurrentSessions: number;
};

type HostNetworkFormFieldsProps = {
  form: UseFormReturn<any>;
};

const HostNetworkFormFields: React.FC<HostNetworkFormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h4 className="text-sm font-medium text-muted-foreground">License Constraints</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="maxHosts"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Max Hosts
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Leave empty for unlimited
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="concurrentSessions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Concurrent Sessions
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="usageHoursLimit"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Usage Hours Limit
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Unlimited"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
              />
            </FormControl>
            <FormDescription className="text-xs">
              Maximum hours of usage allowed (leave empty for unlimited)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allowedNetworks"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Allowed Networks
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="192.168.1.0/24, 10.0.0.0/8"
                className="min-h-[60px]"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs">
              Comma-separated list of allowed network CIDRs (leave empty for any network)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default HostNetworkFormFields;
