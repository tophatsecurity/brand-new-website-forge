
import React from 'react';
import { Shield, Search, Database, FileCode, AlertTriangle, Network } from 'lucide-react';

const KeyFeatures = () => {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Dependency Visualization",
      description: "Interactive mapping of software dependencies with TrustTrees visualization for comprehensive supply chain visibility."
    },
    {
      icon: <Shield className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Forensic Code Analysis",
      description: "Deep forensic inspection of binaries and source code to detect suspicious patterns and potential backdoors."
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Threat Intelligence",
      description: "Real-time integration with threat intelligence feeds to identify known malicious components and vulnerable dependencies."
    },
    {
      icon: <Database className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Risk Assessment",
      description: "Quantitative risk scoring for all detected issues, categorized by severity and potential impact."
    },
    {
      icon: <FileCode className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Compliance Reporting",
      description: "Automated compliance reporting for regulatory frameworks including NIST, CMMC, and FedRAMP."
    },
    {
      icon: <Network className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Geo-Location Tracking",
      description: "Threat actor geo-location tracking to identify geographic origins of suspicious components."
    }
  ];

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyFeatures;
