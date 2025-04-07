
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const DDX = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <NetworkDiagram />
          <Overview />
          <div className="text-center my-8">
            <Link to="/ddx/use-cases">
              <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                <FileText className="mr-2 h-4 w-4" />
                View Real-World Use Cases
              </Button>
            </Link>
          </div>
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
