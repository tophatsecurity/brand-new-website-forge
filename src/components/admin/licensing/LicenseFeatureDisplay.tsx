
import React from 'react';
import { Package, Gift } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LicenseFeatureDisplayProps {
  features: string[];
  addons: string[];
}

const LicenseFeatureDisplay: React.FC<LicenseFeatureDisplayProps> = ({ features, addons }) => {
  return (
    <div className="flex items-center">
      {features.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-muted-foreground">
                <Package className="h-4 w-4 mr-1" />
                <span>{features.length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <strong>Features:</strong>
              <ul className="mt-1 text-xs">
                {features.map(feature => (
                  <li key={feature}>{feature.replace('_', ' ')}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {addons.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-muted-foreground ml-2">
                <Gift className="h-4 w-4 mr-1" />
                <span>{addons.length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <strong>Add-ons:</strong>
              <ul className="mt-1 text-xs">
                {addons.map(addon => (
                  <li key={addon}>{addon.replace('_', ' ')}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default LicenseFeatureDisplay;
