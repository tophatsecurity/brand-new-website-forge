
import React, { useState } from 'react';
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
import { format, addMonths } from 'date-fns';

// Mock data for licenses
const licensesMockData = [
  { 
    id: "1", 
    key: "THS-PARA-2023-ABCD-1234", 
    product: "ParaGuard", 
    tier: "Enterprise", 
    assignedTo: "acme-corp@example.com", 
    expiryDate: addMonths(new Date(), 8).toISOString(), 
    status: "active",
    seats: 25,
    created: "2025-01-15T00:00:00Z",
    lastActive: "2025-05-01T14:23:00Z",
  },
  { 
    id: "2", 
    key: "THS-SEEK-2022-EFGH-5678", 
    product: "SeekCap", 
    tier: "Professional", 
    assignedTo: "techsolutions@example.com", 
    expiryDate: addMonths(new Date(), 1).toISOString(), 
    status: "expiring-soon",
    seats: 10,
    created: "2024-05-20T00:00:00Z",
    lastActive: "2025-04-28T09:15:00Z",
  },
  { 
    id: "3", 
    key: "THS-DDX-2023-IJKL-9012", 
    product: "DDX", 
    tier: "Standard", 
    assignedTo: "infotech@example.com", 
    expiryDate: addMonths(new Date(), -1).toISOString(), 
    status: "expired",
    seats: 5,
    created: "2024-02-10T00:00:00Z",
    lastActive: "2025-03-15T11:42:00Z",
  },
  { 
    id: "4", 
    key: "THS-SCND-2023-MNOP-3456", 
    product: "SecondLook", 
    tier: "Enterprise", 
    assignedTo: "datacore@example.com", 
    expiryDate: addMonths(new Date(), 16).toISOString(), 
    status: "active",
    seats: 50,
    created: "2024-11-05T00:00:00Z",
    lastActive: "2025-05-04T17:38:00Z",
  },
  { 
    id: "5", 
    key: "THS-PARA-2023-QRST-7890", 
    product: "ParaGuard", 
    tier: "Professional", 
    assignedTo: null, 
    expiryDate: addMonths(new Date(), 12).toISOString(), 
    status: "unassigned",
    seats: 15,
    created: "2025-04-01T00:00:00Z",
    lastActive: null,
  },
];

type FormValues = {
  product: string;
  tier: string;
  seats: number;
  expiryDate: Date;
  email: string;
};

const LicensingAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [licenses, setLicenses] = useState(licensesMockData);
  const [activeTab, setActiveTab] = useState("all");
  
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

  const onSubmit = (data: FormValues) => {
    const randomKey = `THS-${data.product.slice(0, 4).toUpperCase()}-${new Date().getFullYear()}-${generateRandomString(4)}-${generateRandomString(4)}`;
    
    const newLicense = {
      id: Math.random().toString(36).substring(2, 9),
      key: randomKey,
      product: data.product,
      tier: data.tier,
      assignedTo: data.email || null,
      expiryDate: data.expiryDate.toISOString(),
      status: data.email ? "active" : "unassigned",
      seats: data.seats,
      created: new Date().toISOString(),
      lastActive: null,
    };
    
    setLicenses([newLicense, ...licenses]);
    setOpen(false);
    form.reset();
    
    toast({
      title: "License created",
      description: `Created new ${data.product} license with key: ${randomKey}`,
    });
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
                <Button className="flex items-center">Create License</Button>
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
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Professional">Professional</SelectItem>
                                <SelectItem value="Enterprise">Enterprise</SelectItem>
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
                  </form>
                </Form>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={form.handleSubmit(onSubmit)}>Create License</Button>
                </DialogFooter>
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
                      {filteredLicenses.length === 0 ? (
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
                                {license.key}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => handleCopyKey(license.key)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{license.product}</TableCell>
                            <TableCell>{license.tier}</TableCell>
                            <TableCell>
                              {license.assignedTo || (
                                <span className="text-muted-foreground italic">Unassigned</span>
                              )}
                            </TableCell>
                            <TableCell>{license.seats}</TableCell>
                            <TableCell>{format(new Date(license.expiryDate), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{getStatusBadge(license.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleCopyKey(license.key)}>
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
