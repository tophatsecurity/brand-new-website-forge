import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Server, Zap, Database, Network, Lock, AlertCircle, Activity, Eye } from 'lucide-react';

interface BenefitProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface UseCaseProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const benefits: BenefitProps[] = [
  {
    title: "Military-Grade Security",
    description: "Proven in real-world military deployments",
    icon: <Shield className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Complete Visibility",
    description: "Ensures full network visibility without hardware taps",
    icon: <Eye className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Industrial Protocol Support",
    description: "Supports critical SCADA & ICS protocols for industrial cybersecurity",
    icon: <Server className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Vendor Flexibility",
    description: "Works with multiple switch vendors (Cisco, Ubiquiti, expandable to others)",
    icon: <Network className="h-6 w-6 text-[#cc0c1a]" />
  }
];

const useCases: UseCaseProps[] = [
  {
    title: "Military & Government",
    description: "Actively deployed and used for classified network security operations.",
    icon: <Shield className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Enterprise IT & MSSPs",
    description: "Gain deep network visibility without reconfiguring switches.",
    icon: <Server className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Industrial & SCADA Security",
    description: "Monitor and protect critical infrastructure from cyber threats.",
    icon: <Lock className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "ICS & IIoT Monitoring",
    description: "Identify anomalies in industrial networks using SCADA protocol decoding.",
    icon: <Activity className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Threat Hunting & Forensics",
    description: "Capture and correlate network packets for security investigations.",
    icon: <AlertCircle className="h-6 w-6 text-[#cc0c1a]" />
  }
];

const BenefitsSection = () => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">SEEKCAP: Benefits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#cc0c1a] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              {benefit.icon}
              <h3 className="ml-3 text-lg font-semibold">{benefit.title}</h3>
            </div>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {useCases.map((useCase, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#cc0c1a]">
            <div className="flex items-center mb-4">
              {useCase.icon}
              <h3 className="ml-3 font-semibold">{useCase.title}</h3>
            </div>
            <p className="text-sm text-gray-700">{useCase.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;
