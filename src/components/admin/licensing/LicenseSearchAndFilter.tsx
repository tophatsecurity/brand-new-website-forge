
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Search, Filter, X } from "lucide-react";

interface LicenseSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  featureFilter: string | null;
  setFeatureFilter: (feature: string | null) => void;
  addonFilter: string | null;
  setAddonFilter: (addon: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  features: string[];
  addons: string[];
}

const LicenseSearchAndFilter: React.FC<LicenseSearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  featureFilter,
  setFeatureFilter,
  addonFilter,
  setAddonFilter,
  activeTab,
  setActiveTab,
  features,
  addons
}) => {
  const clearSearchTerm = () => setSearchTerm("");
  const clearFeatureFilter = () => setFeatureFilter(null);
  const clearAddonFilter = () => setAddonFilter(null);
  
  const clearAllFilters = () => {
    setSearchTerm("");
    setFeatureFilter(null);
    setAddonFilter(null);
    setActiveTab("all");
  };
  
  // Count active filters
  const activeFilterCount = [
    searchTerm && searchTerm.length > 0,
    featureFilter !== null,
    addonFilter !== null,
    activeTab !== "all"
  ].filter(Boolean).length;
  
  return (
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
  );
};

export default LicenseSearchAndFilter;
