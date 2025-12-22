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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, differenceInDays, isPast } from 'date-fns';
import {
  Package,
  Gift,
  Copy,
  Calendar,
  Key,
  Loader2,
  Shield,
  Network,
  Eye,
  Search,
  AlertTriangle,
  Clock,
  RefreshCw,
  Wrench,
  Headphones
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const productIcons: Record<string, React.ElementType> = {
  'SEEKCAP': Search,
  'DDX': Network,
  'PARAGUARD': Shield,
  'SECONDLOOK': Eye,
  'LIGHTFOOT': Wrench,
  'O-RANGE': Network,
  'AURORA SENSE': Package,
};

const Entitlements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('active');
  const [dismissedReminder, setDismissedReminder] = useState(false);

  // Get licenses expiring within 30 days
  const getExpiringLicenses = () => {
    const now = new Date();
    return licenses.filter(license => {
      if (license.status !== 'active') return false;
      const expiryDate = parseISO(license.expiry_date);
      const daysUntilExpiry = differenceInDays(expiryDate, now);
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    }).sort((a, b) => parseISO(a.expiry_date).getTime() - parseISO(b.expiry_date).getTime());
  };

  // Get expired licenses
  const getExpiredLicenses = () => {
    return licenses.filter(license => {
      const expiryDate = parseISO(license.expiry_date);
      return isPast(expiryDate);
    });
  };

  const activeLicenses = licenses.filter(l => l.status === 'active' && !isPast(parseISO(l.expiry_date)));
  const expiredLicenses = getExpiredLicenses();
  const expiringLicenses = getExpiringLicenses();
  const hasExpiringOrExpired = expiringLicenses.length > 0 || expiredLicenses.length > 0;

  useEffect(() => {
    const fetchLicenses = async () => {
      if (!user) {
        setLoading(false);
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
            tier_name: license.tier?.name || 'Standard',
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
    };
    
    fetchLicenses();
  }, [user]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "License key copied to clipboard."
    });
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

  const getStatusBadge = (status: string, expiryDate: string) => {
    const isExpired = isPast(parseISO(expiryDate));
    if (isExpired) {
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">Expired</Badge>;
    }
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">Active</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderLicenseTable = (licenseList: License[]) => (
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
          ) : licenseList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <Key className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">No licenses found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Visit the Catalog to explore available products.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            licenseList.map((license) => {
              const IconComponent = productIcons[license.product_name] || Package;
              return (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      {license.product_name}
                    </div>
                  </TableCell>
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
                  <TableCell>{getStatusBadge(license.status, license.expiry_date)}</TableCell>
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <UserLayout title="Entitlements">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Key className="h-7 w-7 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">My Entitlements</h2>
              <p className="text-sm text-muted-foreground">View your active licenses, services, and subscriptions</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <a href="/catalog">
              <Package className="h-4 w-4 mr-2" />
              Browse Catalog
            </a>
          </Button>
        </div>

        {/* License Renewal Reminder Banner */}
        {hasExpiringOrExpired && !dismissedReminder && (
          <Alert variant={expiredLicenses.length > 0 ? "destructive" : "default"} className="relative">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              {expiredLicenses.length > 0 ? 'Expired Licenses' : 'Licenses Expiring Soon'}
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
                          {license.product_name}
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
                  <Button size="sm" variant="ghost" onClick={() => setDismissedReminder(true)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeLicenses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{expiringLicenses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiredLicenses.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="active" className="gap-2">
              <Key className="h-4 w-4" />
              Active
              {activeLicenses.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{activeLicenses.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="expiring" className="gap-2">
              <Clock className="h-4 w-4" />
              Expiring
              {expiringLicenses.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{expiringLicenses.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="expired" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Expired
              {expiredLicenses.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">{expiredLicenses.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Active Licenses
                </CardTitle>
                <CardDescription>Your currently active product licenses and services</CardDescription>
              </CardHeader>
              <CardContent>
                {renderLicenseTable(activeLicenses)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expiring" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Expiring Soon
                </CardTitle>
                <CardDescription>Licenses expiring within the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {renderLicenseTable(expiringLicenses)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expired" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Expired Licenses
                </CardTitle>
                <CardDescription>Licenses that have expired and need renewal</CardDescription>
              </CardHeader>
              <CardContent>
                {renderLicenseTable(expiredLicenses)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Need Help?
            </CardTitle>
            <CardDescription>Contact our support team for license issues, renewals, or additional seats.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="mailto:licensing@tophatsecurity.com">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/catalog">Browse Catalog</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Entitlements;
