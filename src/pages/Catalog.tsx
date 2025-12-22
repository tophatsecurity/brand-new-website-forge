import React, { useState, useEffect } from 'react';
import UserLayout from "@/components/layouts/UserLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addDays } from 'date-fns';
import {
  Package,
  Calendar,
  Sparkles,
  CheckCircle2,
  Loader2,
  Shield,
  Network,
  Eye,
  Search,
  Lock,
  CreditCard,
  Wrench,
  ShoppingCart,
  Layers,
  Headphones,
  Settings2
} from "lucide-react";
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

type CatalogItem = {
  id: string;
  product_name: string;
  description: string;
  product_type: string;
  license_model: string;
  demo_duration_days: number;
  demo_seats: number;
  demo_features: string[];
  base_price: number;
  price_tier: string;
  support_level: string;
  sku: string | null;
};

type License = {
  id: string;
  product_name: string;
};

const productIcons: Record<string, React.ElementType> = {
  'SEEKCAP': Search,
  'DDX': Network,
  'PARAGUARD': Shield,
  'SECONDLOOK': Eye,
  'LIGHTFOOT': Wrench,
  'O-RANGE': Network,
  'AURORA SENSE': Package,
};

const Catalog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: paymentStatus, isFreeUser, refetch: refetchPayment } = useAccountPayment();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingDemo, setGeneratingDemo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('software');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const hasLicenseForProduct = (productName: string) => {
    return licenses.some(l => l.product_name === productName);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch catalog - exclude demo products from purchase catalog
        const { data: catalogData, error: catalogError } = await supabase
          .from('license_catalog')
          .select('*')
          .eq('is_active', true)
          .neq('product_type', 'demo');
          
        if (catalogError) {
          console.error('Error fetching catalog:', catalogError);
        } else {
          setCatalog(catalogData || []);
        }

        // Fetch user's existing licenses
        const { data: licenseData, error: licenseError } = await supabase
          .from('product_licenses')
          .select('id, product_name')
          .eq('assigned_to', user.email);
          
        if (!licenseError && licenseData) {
          setLicenses(licenseData);
        }
      } catch (err) {
        console.error('Exception fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const generateDemoLicense = async (catalogItem: CatalogItem) => {
    if (!user?.email) {
      toast({
        title: "Authentication required",
        description: "Please log in to request a demo license.",
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

      const { error } = await supabase
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
        });

      if (error) throw error;

      setLicenses(prev => [...prev, { id: crypto.randomUUID(), product_name: catalogItem.product_name }]);

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

  // Group products by product_name
  const groupProductsByName = (products: CatalogItem[]) => {
    const grouped: Record<string, CatalogItem[]> = {};
    products.forEach(item => {
      if (!grouped[item.product_name]) {
        grouped[item.product_name] = [];
      }
      grouped[item.product_name].push(item);
    });
    // Sort variants: free first, then evaluation, then by price_tier
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const tierOrder = ['free', 'evaluation', 'standard', 'professional', 'elite', 'enterprise'];
        const aIndex = tierOrder.indexOf(a.price_tier?.toLowerCase() || 'standard');
        const bIndex = tierOrder.indexOf(b.price_tier?.toLowerCase() || 'standard');
        return aIndex - bIndex;
      });
    });
    return grouped;
  };

  const softwareProducts = catalog.filter(c => c.product_type === 'software' || c.product_type === 'free' || c.product_type === 'evaluation');
  const maintenanceProducts = catalog.filter(c => c.product_type === 'maintenance');
  const serviceProducts = catalog.filter(c => c.product_type === 'service');
  const bundleProducts = catalog.filter(c => c.product_type === 'bundle');

  const groupedSoftware = groupProductsByName(softwareProducts);
  const groupedMaintenance = groupProductsByName(maintenanceProducts);
  const groupedServices = groupProductsByName(serviceProducts);
  const groupedBundles = groupProductsByName(bundleProducts);

  const renderProductCard = (item: CatalogItem) => {
    const hasLicense = hasLicenseForProduct(item.product_name);
    const IconComponent = productIcons[item.product_name] || Package;
    const isService = item.product_type === 'service';
    const isMaintenance = item.product_type === 'maintenance';
    const isFreeOrEvaluation = item.product_type === 'free' || item.product_type === 'evaluation';
    
    return (
      <Card key={item.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Show tier/variant name instead of product name */}
              <span className="capitalize">
                {item.price_tier || item.license_model || 'Standard'}
              </span>
              {(item.product_type === 'free' || item.product_type === 'evaluation') && (
                <Badge variant="secondary" className="text-xs capitalize">{item.product_type}</Badge>
              )}
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
          <div className="space-y-3 text-sm">
            {item.sku && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{item.sku}</code>
              </div>
            )}
            {item.base_price > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Starting at:</span>
                <span className="font-semibold">${item.base_price.toLocaleString()}</span>
              </div>
            )}
            {!isService && !isMaintenance && (
              <>
                {isFreeOrEvaluation && (
                  <>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {item.demo_duration_days}-day {item.product_type} period
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Package className="h-4 w-4 mr-2" />
                      {item.demo_seats} seat{item.demo_seats > 1 ? 's' : ''} included
                    </div>
                  </>
                )}
                {item.demo_features.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.demo_features.slice(0, 3).map(feature => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {item.demo_features.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{item.demo_features.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            {isMaintenance && (
              <div className="flex items-center text-muted-foreground">
                <Settings2 className="h-4 w-4 mr-2" />
                Annual maintenance & updates
              </div>
            )}
            {isService && (
              <div className="flex items-center text-muted-foreground">
                <Headphones className="h-4 w-4 mr-2" />
                Professional services
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {isService || isMaintenance ? (
            isFreeUser ? (
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => setShowPaymentDialog(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Add Payment to Purchase
              </Button>
            ) : (
              <Button className="w-full" variant="outline" asChild>
                <a href="/contact">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Contact Sales
                </a>
              </Button>
            )
          ) : (
            <>
              <Button 
                className="flex-1" 
                variant="outline"
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
                    Licensed
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try Demo
                  </>
                )}
              </Button>
              {isFreeUser ? (
                <Button 
                  className="flex-1" 
                  onClick={() => setShowPaymentDialog(true)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Purchase
                </Button>
              ) : (
                <Button className="flex-1" asChild>
                  <a href="/contact">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase
                  </a>
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <UserLayout title="Catalog">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-7 w-7 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Product Catalog</h2>
              <p className="text-sm text-muted-foreground">Browse products available for purchase or demo</p>
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
            <Button variant="outline" size="sm" asChild>
              <a href="/entitlements">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                My Entitlements
              </a>
            </Button>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a payment method to unlock purchasing and convert from free tier.
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="software" className="gap-2">
              <Package className="h-4 w-4" />
              Software
              {softwareProducts.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{softwareProducts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Headphones className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="bundles" className="gap-2">
              <Layers className="h-4 w-4" />
              Bundles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="software" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : Object.keys(groupedSoftware).length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No software products available</h3>
                <p className="text-muted-foreground">Check back soon for new products.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedSoftware).map(([productName, variants]) => {
                  const IconComponent = productIcons[productName] || Package;
                  return (
                    <div key={productName} className="space-y-4">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold">{productName}</h3>
                        <Badge variant="outline">{variants.length} variant{variants.length > 1 ? 's' : ''}</Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {variants.map(renderProductCard)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : Object.keys(groupedMaintenance).length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <Settings2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No maintenance packages available</h3>
                <p className="text-muted-foreground">Maintenance packages will appear here.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedMaintenance).map(([productName, variants]) => {
                  const IconComponent = productIcons[productName] || Package;
                  return (
                    <div key={productName} className="space-y-4">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold">{productName}</h3>
                        <Badge variant="outline">{variants.length} variant{variants.length > 1 ? 's' : ''}</Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {variants.map(renderProductCard)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : Object.keys(groupedServices).length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <Headphones className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No service packages available</h3>
                <p className="text-muted-foreground">Professional services will appear here.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedServices).map(([productName, variants]) => {
                  const IconComponent = productIcons[productName] || Package;
                  return (
                    <div key={productName} className="space-y-4">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold">{productName}</h3>
                        <Badge variant="outline">{variants.length} variant{variants.length > 1 ? 's' : ''}</Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {variants.map(renderProductCard)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bundles" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : Object.keys(groupedBundles).length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No bundles available</h3>
                <p className="text-muted-foreground">Product bundles will appear here.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedBundles).map(([productName, variants]) => {
                  const IconComponent = productIcons[productName] || Package;
                  return (
                    <div key={productName} className="space-y-4">
                      <div className="flex items-center gap-3 border-b pb-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold">{productName}</h3>
                        <Badge variant="outline">{variants.length} variant{variants.length > 1 ? 's' : ''}</Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {variants.map(renderProductCard)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Help Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Need Help Choosing?
            </CardTitle>
            <CardDescription>Our sales team can help you find the right products for your needs.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="mailto:sales@tophatsecurity.com">Contact Sales</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/entitlements">View My Entitlements</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Catalog;
