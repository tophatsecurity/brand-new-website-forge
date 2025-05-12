
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NetworkDiagram from '@/components/ddx/NetworkDiagram';
import Overview from '@/components/ddx/Overview';
import KeyFeatures from '@/components/ddx/KeyFeatures';
import CallToAction from '@/components/ddx/CallToAction';
import ComprehensiveCoverage from '@/components/ddx/ComprehensiveCoverage';
import AdvancedFeatures from '@/components/ddx/AdvancedFeatures';
import FrameworkCompliance from '@/components/ddx/FrameworkCompliance';
import FAQ from '@/components/ddx/FAQ';
import AnalysisTable from '@/components/ddx/AnalysisTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const DDX = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
              Supply Chain Security
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">DDX</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Cyber Supply Chain Forensic Inspection Platform
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
                    src="/lovable-uploads/051a0085-f9a9-4723-ac0b-3c746a4cedd8.png" 
                    alt="DDX Dashboard" 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center my-8">
            <Link to="/ddx/use-cases">
              <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                <FileText className="mr-2 h-4 w-4" />
                View Real-World Use Cases
              </Button>
            </Link>
          </div>
          <Overview />
          <ComprehensiveCoverage />
          <KeyFeatures />
          <AnalysisTable />
          <AdvancedFeatures />
          <FrameworkCompliance />
          <FAQ />
          <CallToAction />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DDX;
