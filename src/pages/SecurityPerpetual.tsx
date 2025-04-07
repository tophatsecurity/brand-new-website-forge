
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PerpetualEvalSection from '@/components/perpetual/PerpetualEvalSection';
import PerpetualFeatures from '@/components/perpetual/PerpetualFeatures';
import PerpetualProcessSteps from '@/components/perpetual/PerpetualProcessSteps';
import PerpetualCallToAction from '@/components/perpetual/PerpetualCallToAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SecurityPerpetual = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
              Security Services
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Security Perpetual Evaluation</h1>
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
          
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="relative w-full max-w-4xl">
                <div className="absolute inset-0 blur-lg bg-gradient-to-r from-[#cc0c1a]/20 to-[#222]/20 rounded-2xl transform -rotate-6"></div>
                <div className="relative bg-white rounded-xl overflow-hidden border p-8 shadow-md">
                  <img 
                    src="/lovable-uploads/5e60e263-f754-4df8-907c-e70ae724fdc6.png" 
                    alt="Security Perpetual Evaluation Dashboard" 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <PerpetualEvalSection />
          <PerpetualFeatures />
          <PerpetualProcessSteps />
          <PerpetualCallToAction />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SecurityPerpetual;
