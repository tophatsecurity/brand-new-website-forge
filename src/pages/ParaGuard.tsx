
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParaGuardHero from '@/components/paraguard/ParaGuardHero';
import ComparisonTable from '@/components/paraguard/ComparisonTable';
import DetectionCapabilities from '@/components/paraguard/DetectionCapabilities';
import DeploymentModels from '@/components/paraguard/DeploymentModels';
import ResponseLifecycle from '@/components/paraguard/ResponseLifecycle';
import ParaGuardCallToAction from '@/components/paraguard/ParaGuardCallToAction';

const ParaGuard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
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
      </div>
      <Footer />
    </div>
  );
};

export default ParaGuard;
