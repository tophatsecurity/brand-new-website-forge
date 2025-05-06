
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import {
  Package,
  Gift,
  Copy,
  Calendar
} from "lucide-react";
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
  tier: {
    name: string;
  };
  tier_name: string;
  assigned_to: string | null;
  expiry_date: string;
  status: string;
  seats: number;
  features: string[];
  addons: string[];
};

const Licensing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserLicenses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Only fetch licenses assigned to the current user's email
        const { data, error } = await supabase
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
          .eq('assigned_to', user.email)
          .eq('status', 'active');
          
        if (error) {
          console.error('Error fetching licenses:', error);
          toast({
            title: "Error loading licenses",
            description: error.message,
            variant: "destructive"
          });
        } else {
          // Process the data to make it easier to use in the UI
          const processedData = data.map(license => ({
            ...license,
            tier_name: license.tier?.name || 'Unknown',
            features: Array.isArray(license.features) ? license.features : [],
            addons: Array.isArray(license.addons) ? license.addons : []
          }));
          setLicenses(processedData || []);
        }
      } catch (err) {
        console.error('Exception fetching license data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserLicenses();
  }, [user, toast]);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">License Management</h1>
            {user?.user_metadata?.role === 'admin' && (
              <Button asChild>
                <a href="/admin/licensing">Admin Licenses</a>
              </Button>
            )}
          </div>

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
                    <TableHead>Features & Add-ons</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading your licenses...
                      </TableCell>
                    </TableRow>
                  ) : licenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No active licenses found. Contact the administrator to request a license.
                      </TableCell>
                    </TableRow>
                  ) : (
                    licenses.map((license) => (
                      <TableRow key={license.id}>
                        <TableCell className="font-medium">
                          {license.product_name}
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
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Active
                          </Badge>
                        </TableCell>
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

          <div className="mt-8 bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              If you're experiencing issues with your license or need to request additional seats,
              please contact our support team.
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:licensing@tophatsecurity.com">Contact Licensing Support</a>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Licensing;
