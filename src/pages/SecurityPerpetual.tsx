
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import PerpetualEvalSection from '@/components/perpetual/PerpetualEvalSection';
import PerpetualFeatures from '@/components/perpetual/PerpetualFeatures';
import PerpetualProcessSteps from '@/components/perpetual/PerpetualProcessSteps';
import PerpetualCallToAction from '@/components/perpetual/PerpetualCallToAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SecurityPerpetual = () => {
  return (
    <MainLayout containerClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
          Product Security Services
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Security Perpetual Evaluation</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          Continuous security assessment and monitoring for evolving threat landscapes
        </p>
        
        <div className="flex justify-center">
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
              Request a Demo
            </Button>
          </Link>
        </div>
      </div>
      
      <PerpetualEvalSection />
      <PerpetualFeatures />
      <PerpetualProcessSteps />
      <PerpetualCallToAction />
    </MainLayout>
  );
};

export default SecurityPerpetual;
