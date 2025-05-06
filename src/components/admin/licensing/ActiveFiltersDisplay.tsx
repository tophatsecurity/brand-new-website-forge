
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersDisplayProps {
  featureFilter: string | null;
  addonFilter: string | null;
  clearFeatureFilter: () => void;
  clearAddonFilter: () => void;
}

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
  featureFilter,
  addonFilter,
  clearFeatureFilter,
  clearAddonFilter
}) => {
  if (!featureFilter && !addonFilter) {
    return null;
  }
  
  return (
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
  );
};

export default ActiveFiltersDisplay;
