
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
import { Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLicenses } from "@/hooks/useLicenses";
import LicenseForm from "@/components/admin/licensing/LicenseForm";
import LicenseTable from "@/components/admin/licensing/LicenseTable";
import LicenseStatusFilter from "@/components/admin/licensing/LicenseStatusFilter";

const LicensingAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { licenses, tiers, loading, addLicense } = useLicenses();
  
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
              <div className="flex justify-between items-center mb-6">
                <LicenseStatusFilter activeTab={activeTab} onChange={setActiveTab} />
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search licenses..." 
                    className="w-64"
                  />
                </div>
              </div>
              
              <TabsContent value={activeTab}>
                <LicenseTable 
                  licenses={filteredLicenses} 
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
