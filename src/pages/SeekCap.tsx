
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Overview from '@/components/seekcap/Overview';
import KeyFeatures from '@/components/seekcap/KeyFeatures';
import BenefitsSection from '@/components/seekcap/BenefitsSection';
import ProtocolSupport from '@/components/seekcap/ProtocolSupport';
import DeploymentOptions from '@/components/seekcap/DeploymentOptions';
import NetworkDiagram from '@/components/seekcap/NetworkDiagram';
import CallToAction from '@/components/seekcap/CallToAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SeekCap = () => {
  return (
    <MainLayout containerClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
          Asset Management Solutions
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">SeekCAP</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          Industrial network visibility and complete OT/ICS monitoring solution
        </p>
        
        <div className="flex justify-center">
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
              Request a Demo
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-12">
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl">
            <div className="absolute inset-0 blur-lg bg-gradient-to-r from-[#cc0c1a]/20 to-[#222]/20 rounded-2xl transform -rotate-6"></div>
            <div className="relative bg-white rounded-xl overflow-hidden border p-8 shadow-md">
              <img 
                src="/lovable-uploads/a511ebb5-eb08-41fb-8517-00b96e1b0576.png" 
                alt="SeekCAP Dashboard" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Overview />
      <BenefitsSection />
      <ProtocolSupport />
      <KeyFeatures />
      <DeploymentOptions />
      <CallToAction />
    </MainLayout>
  );
};

export default SeekCap;
