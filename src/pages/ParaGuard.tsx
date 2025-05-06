
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ParaGuardHero from '@/components/paraguard/ParaGuardHero';
import ComparisonTable from '@/components/paraguard/ComparisonTable';
import DetectionCapabilities from '@/components/paraguard/DetectionCapabilities';
import DeploymentModels from '@/components/paraguard/DeploymentModels';
import ResponseLifecycle from '@/components/paraguard/ResponseLifecycle';
import ParaGuardCallToAction from '@/components/paraguard/ParaGuardCallToAction';

const ParaGuard = () => {
  return (
    <MainLayout fullWidth paddingTop="small">
      {/* Hero Section */}
      <ParaGuardHero />

      {/* ParaGuard vs Traditional Security */}
      <ComparisonTable />

      {/* Advanced Detection Capabilities */}
      <DetectionCapabilities />

      {/* Deployment Models */}
      <DeploymentModels />

      {/* Response Lifecycle */}
      <ResponseLifecycle />

      {/* Call to Action */}
      <ParaGuardCallToAction />
    </MainLayout>
  );
};

export default ParaGuard;
