
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { 
  Key, 
  User, 
  Calendar, 
  MoreHorizontal, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  PauseCircle 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, parseISO } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";

type FormValues = {
  product: string;
  tier: string;
  seats: number;
  expiryDate: Date;
  email: string;
};

type License = {
  id: string;
  license_key: string;
  product_name: string;
  tier: {
    name: string;
  };
  assigned_to: string | null;
  expiry_date: string;
  status: string;
  seats: number;
  created_at: string;
  last_active: string | null;
};

type LicenseTier = {
  id: string;
  name: string;
  description: string;
  max_seats: number;
};

const LicensingAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [tiers, setTiers] = useState<LicenseTier[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  
  const form = useForm<FormValues>({
    defaultValues: {
      product: "",
      tier: "",
      seats: 1,
      expiryDate: addMonths(new Date(), 12),
      email: "",
    },
  });
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchLicensesAndTiers = async () => {
      setLoading(true);
      try {
        // Fetch licenses with tier details
        const { data: licensesData, error: licensesError } = await supabase
          .from('product_licenses')
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
          .order('created_at', { ascending: false });
          
        if (licensesError) {
          console.error('Error fetching licenses:', licensesError);
          toast({
            title: "Error loading licenses",
            description: licensesError.message,
            variant: "destructive"
          });
        } else {
          setLicenses(licensesData || []);
        }
        
        // Fetch license tiers
        const { data: tiersData, error: tiersError } = await supabase
          .from('license_tiers')
          .select('*')
          .order('max_seats', { ascending: true });
          
        if (tiersError) {
          console.error('Error fetching license tiers:', tiersError);
        } else {
          setTiers(tiersData || []);
        }
      } catch (err) {
        console.error('Exception fetching license data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLicensesAndTiers();
  }, [toast]);

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
        setLicenses([newLicense, ...licenses]);
        setOpen(false);
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

  const generateRandomString = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "License key copied to clipboard.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'expiring-soon':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
      case 'unassigned':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Unassigned</Badge>;
      case 'suspended':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredLicenses = activeTab === "all" 
    ? licenses 
    : licenses.filter(license => license.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Key className="mr-2 h-6 w-6" />
              <h1 className="text-3xl font-bold">License Management</h1>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Key className="mr-2 h-4 w-4" />
                  Create License
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                  <DialogTitle>Create New License</DialogTitle>
                  <DialogDescription>
                    Generate a new license key for your products.
                  </DialogDescription>
                </DialogHeader>
                
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
                      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                      <Button type="submit">
                        <Key className="mr-2 h-4 w-4" />
                        Generate License Key
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="all" className="flex items-center gap-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="active" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="expiring-soon" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expiring Soon
                  </TabsTrigger>
                  <TabsTrigger value="expired" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Expired
                  </TabsTrigger>
                  <TabsTrigger value="unassigned" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Unassigned
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search licenses..." 
                    className="w-64"
                  />
                </div>
              </div>
              
              <TabsContent value={activeTab}>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">License Key</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Seats</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            Loading licenses...
                          </TableCell>
                        </TableRow>
                      ) : filteredLicenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            No licenses found. Create a new license to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLicenses.map((license) => (
                          <TableRow key={license.id}>
                            <TableCell className="font-mono text-xs">
                              <div className="flex items-center gap-1">
                                {license.license_key}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => handleCopyKey(license.license_key)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{license.product_name}</TableCell>
                            <TableCell>{license.tier?.name}</TableCell>
                            <TableCell>
                              {license.assigned_to || (
                                <span className="text-muted-foreground italic">Unassigned</span>
                              )}
                            </TableCell>
                            <TableCell>{license.seats}</TableCell>
                            <TableCell>{format(parseISO(license.expiry_date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{getStatusBadge(license.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleCopyKey(license.license_key)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    <span>Copy Key</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Extend License</span>
                                  </DropdownMenuItem>
                                  {license.status === "active" && (
                                    <DropdownMenuItem>
                                      <PauseCircle className="mr-2 h-4 w-4" />
                                      <span>Suspend License</span>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LicensingAdminPage;
