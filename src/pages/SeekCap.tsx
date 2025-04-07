
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Overview from '@/components/seekcap/Overview';
import KeyFeatures from '@/components/seekcap/KeyFeatures';
import BenefitsSection from '@/components/seekcap/BenefitsSection';
import ProtocolSupport from '@/components/seekcap/ProtocolSupport';
import DeploymentOptions from '@/components/seekcap/DeploymentOptions';
import NetworkDiagram from '@/components/seekcap/NetworkDiagram';
import CallToAction from '@/components/seekcap/CallToAction';

const SeekCap = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <NetworkDiagram />
          <Overview />
          <BenefitsSection />
          <ProtocolSupport />
          <KeyFeatures />
          <DeploymentOptions />
          <CallToAction />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SeekCap;
