
import React from 'react';
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LicenseForm from "@/components/admin/licensing/LicenseForm";

interface LicenseHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  addLicense: (license: any) => void;
  tiers: any[];
}

const LicenseHeader: React.FC<LicenseHeaderProps> = ({ 
  open, 
  setOpen, 
  addLicense, 
  tiers 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center">
        <Key className="mr-2 h-6 w-6" />
        <h1 className="text-3xl font-bold">License Management</h1>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center shrink-0 mt-2 sm:mt-0 bg-primary text-primary-foreground hover:bg-primary/90 z-10">
            <Key className="mr-2 h-4 w-4" />
            Create License
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[540px] z-50">
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
  );
};

export default LicenseHeader;
