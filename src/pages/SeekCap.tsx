
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Shield, Server, Zap, Database, Network, Lock, AlertCircle, Activity } from "lucide-react";

const SeekCap = () => {
  const keyFeatures = [
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

  const protocolCategories = [
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

  const workflowSteps = [
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
              Advanced OT Visibility Solution
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SEEKCAP</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Advanced OT Visibility & Packet Analysis Solution
            </p>
          </div>

          {/* Hero Section with Logo */}
          <div className="flex flex-col md:flex-row gap-8 mb-16 items-center">
            <div className="md:w-1/2">
              <img 
                src="/public/lovable-uploads/42792afe-7790-44c9-8ecb-baf86f069b20.png" 
                alt="SEEKCAP Logo" 
                className="mx-auto max-w-[300px]"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="mb-4">
                <span className="font-semibold">SEEKCAP</span> is a cutting-edge <span className="font-semibold">network visibility and packet analysis solution</span> designed to provide deep insight into remote networks <span className="font-semibold">without requiring a SPAN port</span> on physical switches.
              </p>
              <p className="mb-4">
                By utilizing <span className="font-semibold">native switch telemetry tools</span> and the ability to collect <span className="font-semibold">PCAPs from Ethernet interfaces on other systems</span>, SEEKCAP enables <span className="font-semibold">real-time traffic monitoring and protocol analysis</span> while ensuring minimal network impact.
              </p>
              <p>
                Originally developed for a <span className="font-semibold">military organization</span>, SEEKCAP is currently <span className="font-semibold">in active production use within military networks</span>, delivering <span className="font-semibold">mission-critical network visibility and security monitoring</span>. Tophat Security retains all rights to its source code and continues development to expand its capabilities.
              </p>
            </div>
          </div>

          {/* SCADA & Industrial Protocol Support Section */}
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

          {/* Key Features Section */}
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

          {/* Deployment Options Section */}
          <div className="bg-[#f3f3f3] p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Deployment Options for SeekCap</h2>
            <p className="mb-6">
              SeekCap can be deployed in multiple ways to suit different operational needs, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>On-premise installations</li>
              <li>Client-server architectures</li>
              <li>Standalone hardened laptop deployments</li>
            </ul>
            
            {/* Visual - Network Diagram */}
            <div className="mt-8">
              <img 
                src="/public/lovable-uploads/1428d007-5f52-4f4a-bd6a-d65352b9db3d.png" 
                alt="Network Diagram" 
                className="mx-auto rounded-lg shadow-md max-w-full lg:max-w-[700px]"
              />
              <p className="text-center text-sm text-muted-foreground mt-3">
                SEEKCAP network visibility solution in action
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to enhance your network visibility?</h2>
            <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
              Contact us today to learn more about how SEEKCAP can provide mission-critical visibility to your network infrastructure.
            </p>
            <a 
              href="/contact" 
              className="bg-[#cc0c1a] hover:bg-[#a80916] text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 inline-flex items-center"
            >
              Request a Demo
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SeekCap;
