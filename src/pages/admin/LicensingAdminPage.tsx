
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Key, Filter, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLicenses } from "@/hooks/useLicenses";
import LicenseForm from "@/components/admin/licensing/LicenseForm";
import LicenseTable from "@/components/admin/licensing/LicenseTable";
import LicenseStatusFilter from "@/components/admin/licensing/LicenseStatusFilter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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
    getAllAddons
  } = useLicenses();
  
  // Redirect non-admin users
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

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  const clearFeatureFilter = () => {
    setFeatureFilter(null);
  };

  const clearAddonFilter = () => {
    setAddonFilter(null);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFeatureFilter(null);
    setAddonFilter(null);
    setActiveTab("all");
  };

  const features = getAllFeatures();
  const addons = getAllAddons();
  
  // First filter by status (activeTab)
  const statusFilteredLicenses = activeTab === "all" 
    ? licenses 
    : licenses.filter(license => license.status === activeTab);

  // Count active filters
  const activeFilterCount = [
    searchTerm && searchTerm.length > 0,
    featureFilter !== null,
    addonFilter !== null,
    activeTab !== "all"
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center">
              <Key className="mr-2 h-6 w-6" />
              <h1 className="text-3xl font-bold">License Management</h1>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center shrink-0 mt-2 sm:mt-0">
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
                
                <LicenseForm 
                  tiers={tiers} 
                  onLicenseCreated={addLicense} 
                  onClose={() => setOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <LicenseStatusFilter activeTab={activeTab} onChange={setActiveTab} />
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search licenses..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-8"
                    />
                    {searchTerm && (
                      <button 
                        onClick={clearSearchTerm}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                            {activeFilterCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                          Features
                        </DropdownMenuLabel>
                        {features.length === 0 ? (
                          <DropdownMenuItem disabled>No features available</DropdownMenuItem>
                        ) : (
                          features.map(feature => (
                            <DropdownMenuItem 
                              key={feature}
                              onClick={() => setFeatureFilter(feature)}
                              className={featureFilter === feature ? "bg-secondary" : ""}
                            >
                              {feature.replace(/_/g, ' ')}
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuGroup>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                          Add-ons
                        </DropdownMenuLabel>
                        {addons.length === 0 ? (
                          <DropdownMenuItem disabled>No add-ons available</DropdownMenuItem>
                        ) : (
                          addons.map(addon => (
                            <DropdownMenuItem 
                              key={addon}
                              onClick={() => setAddonFilter(addon)}
                              className={addonFilter === addon ? "bg-secondary" : ""}
                            >
                              {addon.replace(/_/g, ' ')}
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuGroup>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={clearAllFilters}>
                        Clear all filters
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Active filters display */}
              {(featureFilter || addonFilter) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {featureFilter && (
                    <Badge variant="secondary" className="flex gap-1 items-center">
                      Feature: {featureFilter.replace(/_/g, ' ')}
                      <button onClick={clearFeatureFilter}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {addonFilter && (
                    <Badge variant="secondary" className="flex gap-1 items-center">
                      Add-on: {addonFilter.replace(/_/g, ' ')}
                      <button onClick={clearAddonFilter}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
              
              <TabsContent value={activeTab}>
                <LicenseTable 
                  licenses={statusFilteredLicenses} 
                  loading={loading} 
                  onCopyKey={handleCopyKey} 
                />
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
