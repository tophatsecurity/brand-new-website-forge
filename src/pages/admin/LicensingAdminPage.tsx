import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLicenses } from "@/hooks/useLicenses";
import LicenseHeader from "@/components/admin/licensing/LicenseHeader";
import LicenseFilters from "@/components/admin/licensing/LicenseFilters";
import LicenseTable from "@/components/admin/licensing/LicenseTable";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";

const LicensingAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { 
    licenses, 
    tiers, 
    loading, 
    addLicense, 
    searchTerm, 
    setSearchTerm,
    featureFilter,
    setFeatureFilter,
    addonFilter,
    setAddonFilter,
    getAllFeatures,
    getAllAddons,
    refetch
  } = useLicenses();
  
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "License key copied to clipboard.",
    });
  };

  const handleBulkAction = async (action: string, licenseIds: string[]) => {
    try {
      let updateData: Record<string, any> = {};
      
      switch (action) {
        case 'activate':
          updateData = { status: 'active' };
          break;
        case 'suspend':
          updateData = { status: 'suspended' };
          break;
        case 'revoke':
          updateData = { status: 'revoked' };
          break;
        case 'extend_30':
        case 'extend_90': {
          const days = action === 'extend_30' ? 30 : 90;
          // For extend, we need to update each license individually based on current expiry
          for (const id of licenseIds) {
            const license = licenses.find(l => l.id === id);
            if (license) {
              const newExpiry = addDays(new Date(license.expiry_date), days);
              await supabase
                .from('product_licenses')
                .update({ expiry_date: newExpiry.toISOString() })
                .eq('id', id);
            }
          }
          toast({
            title: "Licenses Extended",
            description: `${licenseIds.length} license(s) extended by ${days} days.`,
          });
          refetch?.();
          return;
        }
        case 'export': {
          const selectedLicenses = licenses.filter(l => licenseIds.includes(l.id));
          const csv = [
            ['License Key', 'Product', 'Tier', 'Assigned To', 'Status', 'Expiry Date', 'Seats'].join(','),
            ...selectedLicenses.map(l => [
              l.license_key,
              l.product_name,
              l.tier?.name || '',
              l.assigned_to || '',
              l.status,
              l.expiry_date,
              l.seats
            ].join(','))
          ].join('\n');
          
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'licenses-export.csv';
          a.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "Export Complete",
            description: `${licenseIds.length} license(s) exported.`,
          });
          return;
        }
        default:
          return;
      }

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('product_licenses')
          .update(updateData)
          .in('id', licenseIds);

        if (error) throw error;

        toast({
          title: "Bulk Action Complete",
          description: `${licenseIds.length} license(s) updated.`,
        });
        refetch?.();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  const features = getAllFeatures();
  const addons = getAllAddons();
  
  const statusFilteredLicenses = activeTab === "all" 
    ? licenses 
    : licenses.filter(license => license.status === activeTab);

  return (
    <AdminLayout title="License Management">
      <div className="flex justify-between items-center mb-6">
        <LicenseHeader 
          open={open} 
          setOpen={setOpen} 
          addLicense={addLicense} 
          tiers={tiers} 
        />
        <Button variant="outline" asChild>
          <Link to="/admin/catalog">
            <Package className="h-4 w-4 mr-2" />
            Manage Catalog
          </Link>
        </Button>
      </div>
      
      <div className="bg-card rounded-lg shadow-md p-6 relative z-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <LicenseFilters 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            featureFilter={featureFilter}
            setFeatureFilter={setFeatureFilter}
            addonFilter={addonFilter}
            setAddonFilter={setAddonFilter}
            features={features}
            addons={addons}
          />
          
          <TabsContent value={activeTab}>
            <LicenseTable 
              licenses={statusFilteredLicenses} 
              loading={loading} 
              onCopyKey={handleCopyKey}
              onBulkAction={handleBulkAction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default LicensingAdminPage;
