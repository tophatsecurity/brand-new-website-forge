import React, { useState, useEffect } from 'react';
import UserLayout from "@/components/layouts/UserLayout";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, addDays, differenceInDays, isPast } from 'date-fns';
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
  CreditCard,
  AlertTriangle,
  Bell,
  Clock,
  RefreshCw
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [dismissedReminder, setDismissedReminder] = useState(false);
  
  const hasLicenseForProduct = (productName: string) => {
    return licenses.some(l => l.product_name === productName);
  };

  // Get licenses expiring within 30 days
  const getExpiringLicenses = () => {
    const now = new Date();
    return licenses.filter(license => {
      if (license.status !== 'active') return false;
      const expiryDate = parseISO(license.expiry_date);
      const daysUntilExpiry = differenceInDays(expiryDate, now);
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    }).sort((a, b) => {
      return parseISO(a.expiry_date).getTime() - parseISO(b.expiry_date).getTime();
    });
  };

  // Get expired licenses
  const getExpiredLicenses = () => {
    return licenses.filter(license => {
      const expiryDate = parseISO(license.expiry_date);
      return isPast(expiryDate) && license.status === 'active';
    });
  };

  const expiringLicenses = getExpiringLicenses();
  const expiredLicenses = getExpiredLicenses();
  const hasExpiringOrExpired = expiringLicenses.length > 0 || expiredLicenses.length > 0;

  // Show toast notification for expiring licenses on initial load
  useEffect(() => {
    if (!loading && licenses.length > 0) {
      const expiring = getExpiringLicenses();
      const expired = getExpiredLicenses();
      
      if (expired.length > 0) {
        toast({
          title: `${expired.length} license${expired.length > 1 ? 's' : ''} expired`,
          description: "Please renew your licenses to continue using the products.",
          variant: "destructive",
        });
      } else if (expiring.length > 0) {
        const soonest = expiring[0];
        const daysLeft = differenceInDays(parseISO(soonest.expiry_date), new Date());
        toast({
          title: "License renewal reminder",
          description: `${expiring.length} license${expiring.length > 1 ? 's' : ''} expiring soon. ${soonest.product_name} expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`,
        });
      }
    }
  }, [loading, licenses.length]);

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

  const isServiceProduct = (item: CatalogItem) => item.product_type === 'service';

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
    <UserLayout title="Licensing">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Key className="h-7 w-7 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Product Licensing</h2>
              <p className="text-sm text-muted-foreground">Manage your licenses and try new products</p>
            </div>
            <PaymentStatusBadge />
          </div>
          <div className="flex items-center gap-2">
            {isFreeUser && (
              <Button size="sm" onClick={() => setShowPaymentDialog(true)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            )}
          </div>
        </div>

        {/* License Renewal Reminder Banner */}
        {hasExpiringOrExpired && !dismissedReminder && (
          <Alert variant={expiredLicenses.length > 0 ? "destructive" : "default"} className="relative">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              {expiredLicenses.length > 0 ? (
                <>Expired Licenses</>
              ) : (
                <>Licenses Expiring Soon</>
              )}
            </AlertTitle>
            <AlertDescription>
              <div className="space-y-3">
                {expiredLicenses.length > 0 && (
                  <div>
                    <p className="font-medium text-sm mb-2">
                      {expiredLicenses.length} license{expiredLicenses.length > 1 ? 's have' : ' has'} expired:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {expiredLicenses.map(license => (
                        <Badge key={license.id} variant="destructive" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {license.product_name} - Expired {format(parseISO(license.expiry_date), 'MMM d')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {expiringLicenses.length > 0 && (
                  <div>
                    <p className="font-medium text-sm mb-2">
                      {expiringLicenses.length} license{expiringLicenses.length > 1 ? 's' : ''} expiring within 30 days:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {expiringLicenses.map(license => {
                        const daysLeft = differenceInDays(parseISO(license.expiry_date), new Date());
                        return (
                          <Badge 
                            key={license.id} 
                            variant={daysLeft <= 7 ? "destructive" : "secondary"}
                            className="gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            {license.product_name} - {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" asChild>
                    <a href="mailto:licensing@tophatsecurity.com">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Contact for Renewal
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setDismissedReminder(true)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

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

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="catalog" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Product Catalog
            </TabsTrigger>
            <TabsTrigger value="licenses" className="gap-2">
              <Key className="h-4 w-4" />
              My Licenses
              {licenses.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {licenses.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {catalogLoading ? (
                <div className="col-span-full text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : catalog.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-card rounded-lg">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No products available</h3>
                </div>
              ) : (
                catalog.map(renderProductCard)
              )}
            </div>
          </TabsContent>

          {/* Licenses Tab */}
          <TabsContent value="licenses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Your Licenses
                </CardTitle>
                <CardDescription>
                  View and manage your active product licenses
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                              Go to the Product Catalog tab to start a free demo.
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Contact our support team for license issues or additional seats.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild>
              <a href="mailto:licensing@tophatsecurity.com">Contact Support</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Licensing;
