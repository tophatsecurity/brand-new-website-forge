
import React from 'react';
import { Shield, Server, Zap, Database, Network, Lock } from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const keyFeatures: FeatureProps[] = [
  {
    title: "No SPAN Port Required",
    description: "Captures network traffic without requiring switch port mirroring.",
    icon: <Network className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "PCAP Collection from Ethernet",
    description: "Supports packet capture from remote systems, broadening visibility.",
    icon: <Shield className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "SCADA Protocol Decoding",
    description: "Provides deep packet inspection (DPI) for industrial and critical infrastructure networks.",
    icon: <Server className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Native Switch Tool Integration",
    description: "Uses built-in telemetry features for traffic sampling, reducing overhead.",
    icon: <Zap className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Performance-Optimized Sampling",
    description: "Dynamically adjusts collection rates to prevent congestion.",
    icon: <Database className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Centralized Correlation Engine",
    description: "Offloads packet processing to a secure, high-performance engine.",
    icon: <Lock className="h-6 w-6 text-[#cc0c1a]" />
  },
  {
    title: "Multi-Vendor Support",
    description: "Supports Cisco and Ubiquiti, with simple extensions to other vendors.",
    icon: <Network className="h-6 w-6 text-[#cc0c1a]" />
  }
];

const KeyFeatures = () => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyFeatures.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#cc0c1a] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              {feature.icon}
              <h3 className="ml-3 text-lg font-semibold">{feature.title}</h3>
            </div>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyFeatures;
