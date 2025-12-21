import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { 
  Shield, 
  Zap, 
  Network, 
  Eye, 
  Settings, 
  Lock,
  Cpu,
  Radio,
  Gauge,
  FileSearch,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const Lightfoot = () => {
  useScrollToTop();
  
  const features = [
    {
      icon: <Network className="h-6 w-6" />,
      title: "Native Protocol Support",
      description: "Speaks OT/ICS protocols natively including Modbus, DNP3, EtherNet/IP, OPC-UA, and Profinet without translation layers."
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Passive Discovery",
      description: "Non-intrusive asset discovery and network mapping that won't disrupt critical industrial processes."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightweight Footprint",
      description: "Minimal resource consumption designed for deployment in constrained OT environments without impacting performance."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Vulnerability Assessment",
      description: "Identify security weaknesses in PLCs, RTUs, and HMIs using safe, OT-aware scanning techniques."
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      title: "Real-time Monitoring",
      description: "Continuous monitoring of industrial networks with instant alerts for anomalous behavior or configuration changes."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Zero Trust Ready",
      description: "Supports zero-trust architectures with detailed asset inventory and communication mapping."
    }
  ];

  const protocols = [
    { name: "Modbus TCP/RTU", category: "Industrial" },
    { name: "DNP3", category: "Utilities" },
    { name: "EtherNet/IP", category: "Manufacturing" },
    { name: "OPC-UA", category: "Universal" },
    { name: "Profinet", category: "Automation" },
    { name: "BACnet", category: "Building" },
    { name: "IEC 61850", category: "Power Grid" },
    { name: "S7comm", category: "Siemens" },
    { name: "HART-IP", category: "Process" },
    { name: "CIP", category: "Rockwell" },
  ];

  const useCases = [
    {
      icon: <Cpu className="h-8 w-8 text-[#cc0c1a]" />,
      title: "Manufacturing Plants",
      description: "Monitor PLCs, robotics, and assembly line controllers for unauthorized changes or vulnerabilities."
    },
    {
      icon: <Radio className="h-8 w-8 text-[#cc0c1a]" />,
      title: "Utilities & Energy",
      description: "Secure SCADA systems, substations, and smart grid infrastructure with passive monitoring."
    },
    {
      icon: <Settings className="h-8 w-8 text-[#cc0c1a]" />,
      title: "Oil & Gas",
      description: "Protect pipeline control systems, refineries, and upstream operations from cyber threats."
    },
    {
      icon: <FileSearch className="h-8 w-8 text-[#cc0c1a]" />,
      title: "Compliance Audits",
      description: "Generate comprehensive asset inventories and network maps for IEC 62443 and NERC CIP compliance."
    }
  ];

  return (
    <MainLayout containerClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
          OT/ICS Security
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">LIGHTFOOT</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          A lightfooted probe for OT/ICS networks using native industrial protocols
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover, monitor, and secure your operational technology infrastructure without disrupting critical processes.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
              Request a Demo
            </Button>
          </Link>
          <Link to="/downloads">
            <Button variant="outline">
              Download Trial
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Value Proposition */}
      <div className="mb-16">
        <Card className="bg-gradient-to-br from-muted/50 to-background border-border/50">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#cc0c1a] mb-2">100+</div>
                <div className="text-muted-foreground">Industrial Protocols</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#cc0c1a] mb-2">Zero</div>
                <div className="text-muted-foreground">Process Disruption</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#cc0c1a] mb-2">24/7</div>
                <div className="text-muted-foreground">Real-time Monitoring</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Key Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Purpose-built for operational technology environments where availability and safety are paramount.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-[#cc0c1a]/30 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#cc0c1a]/10 flex items-center justify-center text-[#cc0c1a] mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Protocol Support */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Native Protocol Support</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            LIGHTFOOT speaks the language of industrial systems, enabling deep visibility without translation layers.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {protocols.map((protocol, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="px-4 py-2 text-sm"
            >
              {protocol.name}
              <span className="ml-2 text-xs text-muted-foreground">({protocol.category})</span>
            </Badge>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Industry Applications</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by critical infrastructure operators across multiple sectors.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">{useCase.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why LIGHTFOOT */}
      <section className="mb-16">
        <Card className="bg-muted/30 border-border/50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose LIGHTFOOT?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Non-intrusive deployment with zero impact on operations",
                "Complete asset inventory in minutes, not weeks",
                "Detects rogue devices and unauthorized connections",
                "Maps communication flows between OT assets",
                "Identifies vulnerable firmware and configurations",
                "Supports air-gapped and segmented networks",
                "Generates compliance-ready reports",
                "Integrates with existing SOC/SIEM platforms"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#cc0c1a] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-[#cc0c1a]/10 to-muted/30 border border-border/50">
        <AlertTriangle className="h-12 w-12 text-[#cc0c1a] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Secure Your Industrial Network Today</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Don't wait for a breach to discover what's on your OT network. Get complete visibility with LIGHTFOOT.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
              Schedule a Demo
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">
              View All Products
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Lightfoot;
