
import React from 'react';
import { Shield, Search, Database, FileCode, AlertTriangle, Network, Code, Cpu, Radio, Users, FileDigit, HardDrive } from 'lucide-react';

const KeyFeatures = () => {
  const features = [
    {
      icon: <Code className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Software Code Decompiling & Analysis",
      description: "Supports hundreds of microcodes and languages to identify vulnerabilities and malicious code."
    },
    {
      icon: <Cpu className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Hardware AI/ML Analysis",
      description: "Over 500,000 unique hardware systems supported with AI Vision platform to visually assess ICs, Components and Integrated Chips."
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Vulnerability Management",
      description: "Identifies over 4,400 vulnerabilities in third-party vendors, including 10 zero-day exploits."
    },
    {
      icon: <HardDrive className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Firmware Analysis",
      description: "Detailed analysis of firmware components to detect potential vulnerabilities and exploits."
    },
    {
      icon: <Radio className="h-10 w-10 text-[#cc0c1a]" />,
      title: "RF Analysis",
      description: "Analyzes a wide range of frequencies (VLF, HF, VHF, UHF, SHF) and both analog and digital modes."
    },
    {
      icon: <Users className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Vendor Tracking Correlation",
      description: "Correlates data from 50,000+ manufacturers, suppliers, and vendors to identify supply chain risks."
    },
    {
      icon: <FileDigit className="h-10 w-10 text-[#cc0c1a]" />,
      title: "F-BOM",
      description: "Forensic Bill of Material - Hardware, Firmware, Software and AI Infrastructure with over 2 Billion items in our BOM dataset."
    },
    {
      icon: <Database className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Threat Intelligence",
      description: "600+ Threat Intelligence Feeds to help correlate F-BOMs with known target threats."
    }
  ];

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Core Features</h2>
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
