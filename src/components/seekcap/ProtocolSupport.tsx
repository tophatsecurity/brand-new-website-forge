
import React from 'react';
import { Network, Server, Lock, AlertCircle } from 'lucide-react';

interface ProtocolCategoryProps {
  category: string;
  protocols: string;
}

interface WorkflowStepProps {
  title: string;
  icon: React.ReactNode;
  points: string[];
}

const protocolCategories: ProtocolCategoryProps[] = [
  {
    category: "PLC & Automation:",
    protocols: "ethernetip, modbus, dnp3, profinet, opcda, bacua, mms"
  },
  {
    category: "Energy & Smart Grid:",
    protocols: "iec61850, goose, sv, cdt"
  },
  {
    category: "Building Automation:",
    protocols: "bacnet, knxnetip, lontalk"
  },
  {
    category: "Industrial IoT (IIoT):",
    protocols: "mqtt, coap, hartip, gryphon"
  },
  {
    category: "Fieldbus & Safety Systems:",
    protocols: "profisafe, ethernetpowerlink, opensafety, sercos3, devicenet, cip, asfety"
  },
  {
    category: "Automotive & Transportation:",
    protocols: "canopen, sae1939, tteethernt"
  },
  {
    category: "Aerospace & Real-Time Systems:",
    protocols: "rtps, sinc1, ethercat, egd, uisttdmx512a"
  },
  {
    category: "Wireless & Sensor Networks:",
    protocols: "zigbee"
  }
];

const workflowSteps: WorkflowStepProps[] = [
  {
    title: "Traffic Collection",
    icon: <Network className="h-6 w-6 text-white" />,
    points: [
      "Remote sampling from network switches (no SPAN port needed).",
      "Direct PCAP extraction from Ethernet-connected endpoints."
    ]
  },
  {
    title: "SCADA & Industrial Protocol Decoding",
    icon: <Server className="h-6 w-6 text-white" />,
    points: [
      "Deep packet inspection of industrial, BAC, IoT, and SCADA traffic.",
      "Identifies assets, firmware, metadata, FOCI (Foreign Ownership, Control, or Influence) indicators."
    ]
  },
  {
    title: "Secure Data Transmission",
    icon: <Lock className="h-6 w-6 text-white" />,
    points: [
      "Captured data is securely sent to the correlation engine for processing."
    ]
  },
  {
    title: "Real-Time Analysis & Alerts",
    icon: <AlertCircle className="h-6 w-6 text-white" />,
    points: [
      "Detects network threats, misconfigurations, and performance issues.",
      "Provides actionable intelligence for network forensics and incident response."
    ]
  }
];

const ProtocolSupport = () => {
  return (
    <div className="mb-16 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">SEEKCAP: SCADA & Industrial Protocol Support</h2>
      <p className="mb-6 text-lg">
        SEEKCAP includes decoders for <span className="font-semibold">critical industrial protocols</span>, making it an essential tool for <span className="font-semibold">SCADA, OT, and IIoT security monitoring</span>. Supported protocols include:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {protocolCategories.map((category, index) => (
          <div key={index} className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#cc0c1a]">
            <h3 className="font-bold mb-2">{category.category}</h3>
            <p className="text-sm text-gray-700">{category.protocols}</p>
          </div>
        ))}
      </div>
      
      <h3 className="text-xl font-bold mb-6 text-center">How It Works</h3>
      
      <div className="flex flex-col md:flex-row justify-between items-stretch space-y-4 md:space-y-0 md:space-x-4">
        {workflowSteps.map((step, index) => (
          <div key={index} className="flex-1 relative">
            <div className="bg-black p-6 rounded-lg h-full flex flex-col">
              <div className="flex items-center mb-4">
                {step.icon}
                <h4 className="ml-2 text-white font-semibold">{step.title}</h4>
              </div>
              <ul className="list-disc pl-6 text-white text-sm space-y-2 flex-grow">
                {step.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
            {index < workflowSteps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                <div className="text-white">→</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <img 
          src="/public/lovable-uploads/5e60e263-f754-4df8-907c-e70ae724fdc6.png" 
          alt="SeekCAP Workflow" 
          className="mx-auto rounded-lg shadow-md max-w-full mt-8"
        />
      </div>
    </div>
  );
};

export default ProtocolSupport;
