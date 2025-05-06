
import React from 'react';
import LicenseStatusFilter from './LicenseStatusFilter';
import LicenseSearchAndFilter from './LicenseSearchAndFilter';
import ActiveFiltersDisplay from './ActiveFiltersDisplay';

interface LicenseFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  featureFilter: string | null;
  setFeatureFilter: (feature: string | null) => void;
  addonFilter: string | null;
  setAddonFilter: (addon: string | null) => void;
  features: string[];
  addons: string[];
}

const LicenseFilters: React.FC<LicenseFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  featureFilter,
  setFeatureFilter,
  addonFilter,
  setAddonFilter,
  features,
  addons
}) => {
  const clearFeatureFilter = () => setFeatureFilter(null);
  const clearAddonFilter = () => setAddonFilter(null);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <LicenseStatusFilter activeTab={activeTab} onChange={setActiveTab} />
        
        <LicenseSearchAndFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          featureFilter={featureFilter}
          setFeatureFilter={setFeatureFilter}
          addonFilter={addonFilter}
          setAddonFilter={setAddonFilter}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          features={features}
          addons={addons}
        />
      </div>
      
      <ActiveFiltersDisplay 
        featureFilter={featureFilter}
        addonFilter={addonFilter}
        clearFeatureFilter={clearFeatureFilter}
        clearAddonFilter={clearAddonFilter}
      />
    </>
  );
};

export default LicenseFilters;
