import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLicenses } from "@/hooks/useLicenses";
import LicenseHeader from "@/components/admin/licensing/LicenseHeader";
import LicenseFilters from "@/components/admin/licensing/LicenseFilters";
import LicenseTable from "@/components/admin/licensing/LicenseTable";
import CatalogManagement from "@/components/admin/licensing/CatalogManagement";
import { Key, Package } from "lucide-react";

const LicensingAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [mainTab, setMainTab] = useState("licenses");
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
    getAllAddons
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

  const features = getAllFeatures();
  const addons = getAllAddons();
  
  const statusFilteredLicenses = activeTab === "all" 
    ? licenses 
    : licenses.filter(license => license.status === activeTab);

  return (
    <AdminLayout title="License Management">
      <LicenseHeader 
        open={open} 
        setOpen={setOpen} 
        addLicense={addLicense} 
        tiers={tiers} 
      />
      
      <Tabs value={mainTab} onValueChange={setMainTab} className="mt-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="licenses" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Licenses ({licenses.length})
          </TabsTrigger>
          <TabsTrigger value="catalog" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product Catalog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="mt-6">
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
                />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="catalog" className="mt-6">
          <div className="bg-card rounded-lg shadow-md p-6">
            <CatalogManagement />
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default LicensingAdminPage;
