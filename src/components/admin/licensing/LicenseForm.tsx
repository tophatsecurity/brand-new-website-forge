
import React from 'react';
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { useLicenseForm, type LicenseTier } from "@/hooks/useLicenseForm";
import { productFeatures, productAddons, productOptions } from "./license-data/productOptions";
import ProductTierFormFields from "./form-fields/ProductTierFormFields";
import SeatsExpiryFormFields from "./form-fields/SeatsExpiryFormFields";
import FeatureAddonsFormFields from "./form-fields/FeatureAddonsFormFields";
import EmailAssignmentField from "./form-fields/EmailAssignmentField";

type LicenseFormProps = {
  tiers: LicenseTier[];
  onLicenseCreated: (newLicense: any) => void;
  onClose: () => void;
};

const LicenseForm: React.FC<LicenseFormProps> = ({ tiers, onLicenseCreated, onClose }) => {
  const { form, onSubmit, isSubmitting } = useLicenseForm({
    tiers,
    products: productOptions,
    features: productFeatures,
    addons: productAddons,
    onLicenseCreated,
    onClose
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <ProductTierFormFields form={form} tiers={tiers} />
        <SeatsExpiryFormFields form={form} />
        <FeatureAddonsFormFields 
          form={form} 
          productFeatures={productFeatures} 
          productAddons={productAddons} 
        />
        <EmailAssignmentField form={form} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Key className="mr-2 h-4 w-4" />
            Generate License Key
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LicenseForm;
