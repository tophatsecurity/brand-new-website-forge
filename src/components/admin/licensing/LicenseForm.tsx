
import React from 'react';
import { Key, Save } from "lucide-react";
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

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LicenseForm;
