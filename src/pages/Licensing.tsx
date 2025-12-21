import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, addDays } from 'date-fns';
import {
  Package,
  Gift,
  Copy,
  Calendar,
  Key,
  Sparkles,
  CheckCircle2,
  Loader2,
  LayoutGrid,
  Shield,
  Network,
  Eye,
  Search,
  Lock,
  CreditCard
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccountPayment } from '@/hooks/useAccountPayment';
import { PaymentStatusBadge } from '@/components/PaymentGatedFeature';
import AddPaymentMethodForm from '@/components/AddPaymentMethodForm';

type License = {
  id: string;
  license_key: string;
  product_name: string;
  tier: { name: string } | null;
  tier_name: string;
  assigned_to: string | null;
  expiry_date: string;
  status: string;
  seats: number;
  features: string[];
  addons: string[];
};

type CatalogItem = {
  id: string;
  product_name: string;
  description: string;
  product_type: string;
  demo_duration_days: number;
  demo_seats: number;
  demo_features: string[];
};

const productIcons: Record<string, React.ElementType> = {
  'SEEKCAP': Search,
  'DDX': Network,
  'ParaGuard': Shield,
  'SecondLook': Eye,
};

const Licensing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: paymentStatus, isFreeUser, canAccessPaidFeatures, refetch: refetchPayment } = useAccountPayment();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [generatingDemo, setGeneratingDemo] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'all' | 'licenses' | string>('all');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const hasLicenseForProduct = (productName: string) => {
    return licenses.some(l => l.product_name === productName);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        setCatalogLoading(false);
        return;
      }

      try {
        const { data: licenseData, error: licenseError } = await supabase
          .from('product_licenses')
          .select(`
            id,
            license_key,
            product_name,
            tier:license_tiers(name),
            assigned_to,
            seats,
            expiry_date,
            status,
            features,
            addons
          `)
          .eq('assigned_to', user.email);
          
        if (licenseError) {
          console.error('Error fetching licenses:', licenseError);
        } else {
          const processedData = (licenseData || []).map(license => ({
            ...license,
            tier_name: license.tier?.name || 'Demo',
            features: Array.isArray(license.features) ? license.features : [],
            addons: Array.isArray(license.addons) ? license.addons : []
          }));
          setLicenses(processedData);
        }
      } catch (err) {
        console.error('Exception fetching license data:', err);
      } finally {
        setLoading(false);
      }

      try {
        const { data: catalogData, error: catalogError } = await supabase
          .from('license_catalog')
          .select('*')
          .eq('is_active', true);
          
        if (catalogError) {
          console.error('Error fetching catalog:', catalogError);
        } else {
          setCatalog(catalogData || []);
        }
      } catch (err) {
        console.error('Exception fetching catalog:', err);
      } finally {
        setCatalogLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "License key copied to clipboard."
    });
  };

  const generateDemoLicense = async (catalogItem: CatalogItem) => {
    if (!user?.email) {
      toast({
        title: "Authentication required",
        description: "Please log in to generate a demo license.",
        variant: "destructive"
      });
      return;
    }

    setGeneratingDemo(catalogItem.id);

    try {
      const { data: tiers } = await supabase
        .from('license_tiers')
        .select('id')
        .eq('name', 'Demo')
        .single();

      let tierId = tiers?.id;

      if (!tierId) {
        const { data: anyTier } = await supabase
          .from('license_tiers')
          .select('id')
          .limit(1)
          .single();
        tierId = anyTier?.id;
      }

      if (!tierId) {
        throw new Error('No license tier available');
      }

      const licenseKey = `DEMO-${catalogItem.product_name.toUpperCase().substring(0, 4)}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const expiryDate = addDays(new Date(), catalogItem.demo_duration_days);

      const { data: newLicense, error } = await supabase
        .from('product_licenses')
        .insert({
          license_key: licenseKey,
          product_name: catalogItem.product_name,
          tier_id: tierId,
          assigned_to: user.email,
          seats: catalogItem.demo_seats,
          expiry_date: expiryDate.toISOString(),
          status: 'active',
          features: catalogItem.demo_features,
          addons: []
        })
        .select(`
          id,
          license_key,
          product_name,
          tier:license_tiers(name),
          assigned_to,
          seats,
          expiry_date,
          status,
          features,
          addons
        `)
        .single();

      if (error) throw error;

      const processedLicense = {
        ...newLicense,
        tier_name: newLicense.tier?.name || 'Demo',
        features: Array.isArray(newLicense.features) ? newLicense.features : [],
        addons: Array.isArray(newLicense.addons) ? newLicense.addons : []
      };
      
      setLicenses(prev => [...prev, processedLicense]);

      toast({
        title: "Demo license generated!",
        description: `Your ${catalogItem.demo_duration_days}-day demo license for ${catalogItem.product_name} is now active.`
      });

    } catch (err: any) {
      console.error('Error generating demo license:', err);
      toast({
        title: "Failed to generate demo",
        description: err.message || "An error occurred while generating your demo license.",
        variant: "destructive"
      });
    } finally {
      setGeneratingDemo(null);
    }
  };

  const renderFeatureIcons = (license: License) => {
    if (!license.features || license.features.length === 0) return null;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-muted-foreground cursor-help">
              <Package className="h-4 w-4 mr-1" />
              <span>{license.features.length}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <strong>Features:</strong>
            <ul className="mt-1 text-xs">
              {license.features.map(feature => (
                <li key={feature}>{feature.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  const renderAddonIcons = (license: License) => {
    if (!license.addons || license.addons.length === 0) return null;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-muted-foreground ml-2 cursor-help">
              <Gift className="h-4 w-4 mr-1" />
              <span>{license.addons.length}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <strong>Add-ons:</strong>
            <ul className="mt-1 text-xs">
              {license.addons.map(addon => (
                <li key={addon}>{addon.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">Active</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">Expired</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredCatalog = activeView === 'all' || activeView === 'licenses' 
    ? catalog 
    : catalog.filter(item => item.product_name === activeView);

  const filteredLicenses = activeView === 'all' || activeView === 'licenses'
    ? licenses
    : licenses.filter(l => l.product_name === activeView);

  const isServiceProduct = (item: CatalogItem) => item.product_type === 'service';

  // Check if a product is paid (non-demo)
  const isPaidProduct = (item: CatalogItem) => {
    return item.product_type === 'service' || 
           (item.product_type === 'software' && 
            !['demo', 'alpha', 'beta'].includes(item.product_name.toLowerCase()));
  };

  const renderProductCard = (item: CatalogItem) => {
    const hasLicense = hasLicenseForProduct(item.product_name);
    const IconComponent = productIcons[item.product_name] || Package;
    const isService = isServiceProduct(item);
    
    return (
      <Card key={item.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className="h-5 w-5 text-primary" />
              {item.product_name}
            </div>
            {hasLicense && (
              <Badge variant="secondary" className="ml-2">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Licensed
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-2 text-sm">
            {!isService && (
              <>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {item.demo_duration_days}-day demo period
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Package className="h-4 w-4 mr-2" />
                  {item.demo_seats} seat{item.demo_seats > 1 ? 's' : ''} included
                </div>
                {item.demo_features.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Demo Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.demo_features.map(feature => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {isService && (
              <div className="text-muted-foreground italic">
                Contact sales for service licensing
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {isService ? (
            isFreeUser ? (
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => setShowPaymentDialog(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Add Payment to Contact Sales
              </Button>
            ) : (
              <Button className="w-full" variant="outline" asChild>
                <a href="/contact">Contact Sales</a>
              </Button>
            )
          ) : (
            <Button 
              className="w-full" 
              onClick={() => generateDemoLicense(item)}
              disabled={generatingDemo === item.id || hasLicense}
            >
              {generatingDemo === item.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : hasLicense ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Already Licensed
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Free Demo
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-6rem)] w-full">
            <Sidebar className="border-r pt-4">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center justify-between">
                    <span>Navigation</span>
                    <SidebarTrigger className="h-6 w-6" />
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => setActiveView('all')}
                          isActive={activeView === 'all'}
                        >
                          <LayoutGrid className="h-4 w-4" />
                          <span>All Products</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => setActiveView('licenses')}
                          isActive={activeView === 'licenses'}
                        >
                          <Key className="h-4 w-4" />
                          <span>My Licenses</span>
                          {licenses.length > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {licenses.length}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel>Product Catalog</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {catalogLoading ? (
                        <div className="px-3 py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        catalog.map((item) => {
                          const IconComponent = productIcons[item.product_name] || Package;
                          const hasLicense = hasLicenseForProduct(item.product_name);
                          return (
                            <SidebarMenuItem key={item.id}>
                              <SidebarMenuButton 
                                onClick={() => setActiveView(item.product_name)}
                                isActive={activeView === item.product_name}
                              >
                                <IconComponent className="h-4 w-4" />
                                <span>{item.product_name}</span>
                                {hasLicense && (
                                  <CheckCircle2 className="h-3 w-3 ml-auto text-green-500" />
                                )}
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Key className="h-7 w-7 text-primary" />
                    <h1 className="text-2xl font-bold">
                      {activeView === 'all' && 'Product Catalog'}
                      {activeView === 'licenses' && 'My Licenses'}
                      {activeView !== 'all' && activeView !== 'licenses' && activeView}
                    </h1>
                    <PaymentStatusBadge />
                  </div>
                  <div className="flex items-center gap-2">
                    {isFreeUser && (
                      <Button size="sm" onClick={() => setShowPaymentDialog(true)}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add Payment
                      </Button>
                    )}
                    {user?.user_metadata?.role === 'admin' && (
                      <Button asChild size="sm" variant="outline">
                        <a href="/admin/licensing">Admin Panel</a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Payment Method Dialog */}
                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a payment method to unlock paid features and convert from free tier.
                      </DialogDescription>
                    </DialogHeader>
                    <AddPaymentMethodForm
                      accountId={paymentStatus?.accountId || undefined}
                      onSuccess={() => {
                        setShowPaymentDialog(false);
                        refetchPayment();
                      }}
                      onCancel={() => setShowPaymentDialog(false)}
                    />
                  </DialogContent>
                </Dialog>

                {activeView === 'licenses' ? (
                  <div className="bg-card rounded-lg shadow-md p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>License Key</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Seats</TableHead>
                            <TableHead>Features</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                              </TableCell>
                            </TableRow>
                          ) : licenses.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <Key className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <p className="font-medium">No licenses yet</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Select a product to start a free demo.
                                </p>
                              </TableCell>
                            </TableRow>
                          ) : (
                            licenses.map((license) => (
                              <TableRow key={license.id}>
                                <TableCell className="font-medium">{license.product_name}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <code className="bg-muted px-2 py-1 rounded text-xs max-w-[120px] truncate">
                                      {license.license_key}
                                    </code>
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
                                <TableCell>{license.tier_name}</TableCell>
                                <TableCell>{getStatusBadge(license.status)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {format(parseISO(license.expiry_date), 'MMM dd, yyyy')}
                                  </div>
                                </TableCell>
                                <TableCell>{license.seats}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {renderFeatureIcons(license)}
                                    {renderAddonIcons(license)}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {catalogLoading ? (
                        <div className="col-span-2 text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                        </div>
                      ) : filteredCatalog.length === 0 ? (
                        <div className="col-span-2 text-center py-12 bg-card rounded-lg">
                          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No products available</h3>
                        </div>
                      ) : (
                        filteredCatalog.map(renderProductCard)
                      )}
                    </div>

                    {activeView !== 'all' && activeView !== 'licenses' && filteredLicenses.length > 0 && (
                      <div className="bg-card rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Your {activeView} Licenses</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>License Key</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Expiry</TableHead>
                              <TableHead>Seats</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredLicenses.map((license) => (
                              <TableRow key={license.id}>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <code className="bg-muted px-2 py-1 rounded text-xs">
                                      {license.license_key}
                                    </code>
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
                                <TableCell>{getStatusBadge(license.status)}</TableCell>
                                <TableCell>{format(parseISO(license.expiry_date), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>{license.seats}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 bg-card rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Need Help?</h2>
                  <p className="text-muted-foreground mb-4">
                    Contact our support team for license issues or additional seats.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="mailto:licensing@tophatsecurity.com">Contact Support</a>
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Licensing;
