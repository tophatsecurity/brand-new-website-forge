
import React from 'react';
import { Shield, Lock, Search } from 'lucide-react';

const PerpetualEvalSection = () => {
  return (
    <section className="mb-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Continuous Product Security Assessment</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Our Product Security Perpetual Evaluation service provides ongoing security assessment, ensuring your systems remain
          protected against the latest threats and vulnerabilities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#cc0c1a]">
          <div className="text-[#cc0c1a] mb-4">
            <Shield className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Proactive Protection</h3>
          <p className="text-muted-foreground">
            Identify and address vulnerabilities before they can be exploited, maintaining a strong security posture.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#cc0c1a]">
          <div className="text-[#cc0c1a] mb-4">
            <Lock className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Continuous Monitoring</h3>
          <p className="text-muted-foreground">
            24/7 monitoring of your digital assets with real-time alerts for suspicious activities and potential threats.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#cc0c1a]">
          <div className="text-[#cc0c1a] mb-4">
            <Search className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Regular Assessments</h3>
          <p className="text-muted-foreground">
            Scheduled comprehensive security assessments to ensure compliance with industry standards and best practices.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PerpetualEvalSection;
