
import React from 'react';
import { useForm } from "react-hook-form";
import { addMonths } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

type FormValues = {
  product: string;
  tier: string;
  seats: number;
  expiryDate: Date;
  email: string;
};

type LicenseTier = {
  id: string;
  name: string;
  description: string;
  max_seats: number;
};

type LicenseFormProps = {
  tiers: LicenseTier[];
  onLicenseCreated: (newLicense: any) => void;
  onClose: () => void;
};

const LicenseForm: React.FC<LicenseFormProps> = ({ tiers, onLicenseCreated, onClose }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      product: "",
      tier: "",
      seats: 1,
      expiryDate: addMonths(new Date(), 12),
      email: "",
    },
  });

  const generateRandomString = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const onSubmit = async (data: FormValues) => {
    const randomKey = `THS-${data.product.slice(0, 4).toUpperCase()}-${new Date().getFullYear()}-${generateRandomString(4)}-${generateRandomString(4)}`;
    const tierId = tiers.find(t => t.name === data.tier)?.id;
    
    if (!tierId) {
      toast({
        title: "Error creating license",
        description: "Selected tier not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: newLicense, error } = await supabase
        .from('product_licenses')
        .insert({
          license_key: randomKey,
          product_name: data.product,
          tier_id: tierId,
          assigned_to: data.email || null,
          expiry_date: data.expiryDate.toISOString(),
          status: data.email ? "active" : "unassigned",
          seats: data.seats,
        })
        .select(`
          id,
          license_key,
          product_name,
          tier_id,
          tier:license_tiers(name),
          assigned_to,
          seats,
          expiry_date,
          status,
          created_at,
          last_active
        `)
        .single();
        
      if (error) {
        console.error('Error creating license:', error);
        toast({
          title: "Error creating license",
          description: error.message,
          variant: "destructive"
        });
      } else if (newLicense) {
        // Add the new license to the state
        onLicenseCreated(newLicense);
        onClose();
        form.reset();
        
        toast({
          title: "License created",
          description: `Created new ${data.product} license with key: ${randomKey}`,
        });
      }
    } catch (err) {
      console.error('Exception creating license:', err);
      toast({
        title: "Error creating license",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">
            <Key className="mr-2 h-4 w-4" />
            Generate License Key
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LicenseForm;
