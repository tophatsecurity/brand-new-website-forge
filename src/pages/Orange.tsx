import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { 
  Factory, 
  Train, 
  Cpu, 
  Shield, 
  Target,
  Layers,
  Play,
  Copy,
  Workflow,
  Zap,
  Building2,
  FlaskConical,
  CheckCircle2,
  Crosshair,
  FileVideo,
  Upload,
  Wand2,
  Network,
  ArrowRight,
  Database
} from 'lucide-react';

const Orange = () => {
  useScrollToTop();
  
  const features = [
    {
      icon: <FileVideo className="h-6 w-6" />,
      title: "PCAP to Simulator",
      description: "Create fully functional simulators directly from real-world packet captures. Import your PCAPs and O-RANGE builds the digital twin automatically.",
      highlight: true
    },
    {
      icon: <Copy className="h-6 w-6" />,
      title: "Digital Twin Technology",
      description: "Create exact virtual replicas of your OT networks for safe testing and simulation without risking production systems."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Red Team Operations",
      description: "Conduct realistic attack simulations and penetration testing against your digital twin to identify vulnerabilities."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Multi-Environment Simulation",
      description: "Simulate factories, plants, assembly lines, railroads, and any automation-dependent system in a single platform."
    },
    {
      icon: <Play className="h-6 w-6" />,
      title: "Scenario Playback",
      description: "Record, replay, and modify attack scenarios to understand threat impact and test defensive measures."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Training",
      description: "Train your security team on realistic OT threats without putting actual infrastructure at risk."
    }
  ];

  const environments = [
    {
      icon: <Factory className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Manufacturing Facilities",
      description: "Simulate complete factory floors with PLCs, robotics, conveyor systems, and quality control processes.",
      examples: ["Automotive assembly", "Electronics manufacturing", "Food processing", "Pharmaceutical production"]
    },
    {
      icon: <Building2 className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Power Plants & Utilities",
      description: "Model power generation, transmission, and distribution systems with SCADA and substation controls.",
      examples: ["Nuclear facilities", "Solar/wind farms", "Substations", "Smart grid systems"]
    },
    {
      icon: <Train className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Transportation Systems",
      description: "Replicate railroad signaling, traffic management, and logistics automation networks.",
      examples: ["Rail signaling", "Port automation", "Airport systems", "Traffic control"]
    },
    {
      icon: <FlaskConical className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Chemical & Oil/Gas",
      description: "Simulate refineries, pipelines, and chemical processing with safety instrumented systems.",
      examples: ["Refineries", "Pipeline SCADA", "Chemical plants", "Offshore platforms"]
    }
  ];

  const redTeamCapabilities = [
    "Protocol-level attack simulation (Modbus, DNP3, OPC-UA)",
    "Man-in-the-middle attack scenarios",
    "PLC logic manipulation testing",
    "Firmware vulnerability exploitation",
    "Network reconnaissance simulation",
    "Denial of service impact analysis",
    "Supply chain attack modeling",
    "Insider threat scenarios"
  ];

  const pcapFeatures = [
    { icon: <Upload className="h-5 w-5" />, text: "Import PCAP/PCAPNG files from your production network" },
    { icon: <Wand2 className="h-5 w-5" />, text: "Automatic protocol detection and device fingerprinting" },
    { icon: <Network className="h-5 w-5" />, text: "Reconstruct network topology from traffic patterns" },
    { icon: <Database className="h-5 w-5" />, text: "Extract register values, setpoints, and process data" },
    { icon: <Play className="h-5 w-5" />, text: "Generate responsive simulators that behave like real devices" },
    { icon: <Workflow className="h-5 w-5" />, text: "Replay traffic patterns with timing accuracy" },
  ];

  return (
    <MainLayout containerClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
          Digital Twin & Red Team Platform
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">O-RANGE</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Digital twin platform for OT networks — Red teaming without the risk
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Create simulators from real-world packet captures. Simulate factories, plants, assembly lines, 
          railroads, and any automation system to test security without impacting production.
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap">
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

      {/* Value Props */}
      <div className="mb-16">
        <Card className="bg-gradient-to-br from-muted/50 to-background border-border/50">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#cc0c1a] mb-2">PCAP</div>
                <div className="text-muted-foreground text-sm">To Simulator</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#cc0c1a] mb-2">∞</div>
                <div className="text-muted-foreground text-sm">Attack Scenarios</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#cc0c1a] mb-2">Zero</div>
                <div className="text-muted-foreground text-sm">Production Risk</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#cc0c1a] mb-2">100%</div>
                <div className="text-muted-foreground text-sm">Environment Fidelity</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#cc0c1a] mb-2">Real</div>
                <div className="text-muted-foreground text-sm">Protocol Simulation</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PCAP to Simulator - Major Feature */}
      <section className="mb-16">
        <Card className="border-2 border-[#cc0c1a]/30 bg-gradient-to-br from-[#cc0c1a]/5 to-background overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8">
                <Badge className="mb-4 bg-[#cc0c1a] text-white">
                  <FileVideo className="h-3 w-3 mr-1" /> Major Feature
                </Badge>
                <h2 className="text-3xl font-bold mb-4">PCAP to Simulator</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Transform real-world packet captures into fully functional OT/ICS simulators. 
                  O-RANGE analyzes your PCAP files and automatically generates digital twins that 
                  behave exactly like your production environment.
                </p>
                
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <FileVideo className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="font-medium">.pcap</span>
                  </div>
                  <ArrowRight className="h-6 w-6 text-[#cc0c1a]" />
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-lg bg-[#cc0c1a]/10 flex items-center justify-center">
                      <Cpu className="h-6 w-6 text-[#cc0c1a]" />
                    </div>
                    <span className="font-medium">Simulator</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  No manual configuration required. O-RANGE learns device behaviors, protocol patterns, 
                  and process logic directly from your network traffic.
                </p>
              </div>
              
              <div className="bg-muted/30 p-8 border-l border-border/50">
                <h3 className="font-semibold text-lg mb-6">How It Works</h3>
                <div className="space-y-4">
                  {pcapFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#cc0c1a]/10 flex items-center justify-center text-[#cc0c1a] flex-shrink-0">
                        {feature.icon}
                      </div>
                      <span className="text-sm pt-1">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Supported Protocols for PCAP */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Protocols Extracted from PCAPs</h2>
          <p className="text-muted-foreground">O-RANGE understands and simulates 40+ industrial protocols</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Modbus TCP/RTU", "Siemens S7", "EtherNet/IP", "DNP3", "OPC-UA", 
            "BACnet", "Profinet", "IEC 61850", "IEC 104", "HART-IP",
            "CIP", "FINS", "Mitsubishi MELSEC", "GE SRTP", "CODESYS"
          ].map((protocol, index) => (
            <Badge key={index} variant="outline" className="px-3 py-1">
              {protocol}
            </Badge>
          ))}
          <Badge variant="outline" className="px-3 py-1 border-[#cc0c1a] text-[#cc0c1a]">
            + 25 more
          </Badge>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Platform Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Build, test, and attack virtual replicas of your most critical infrastructure.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`border-border/50 hover:border-[#cc0c1a]/30 transition-colors ${
                feature.highlight ? 'ring-2 ring-[#cc0c1a]/20 bg-[#cc0c1a]/5' : ''
              }`}
            >
              <CardHeader>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${
                  feature.highlight ? 'bg-[#cc0c1a] text-white' : 'bg-[#cc0c1a]/10 text-[#cc0c1a]'
                }`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {feature.title}
                  {feature.highlight && <Badge className="bg-[#cc0c1a] text-white text-xs">New</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Environments */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Simulate Any Environment</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O-RANGE can replicate virtually any industrial or automation system.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {environments.map((env, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0">{env.icon}</div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">{env.title}</h3>
                    <p className="text-muted-foreground mb-4">{env.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {env.examples.map((example, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Red Team Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge variant="outline" className="mb-4 text-[#cc0c1a] border-[#cc0c1a]">
              <Crosshair className="h-3 w-3 mr-1" /> Red Team Ready
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Attack Without Consequences</h2>
            <p className="text-muted-foreground mb-6">
              Test your defenses against real-world attack techniques in a safe, 
              isolated environment. O-RANGE enables full red team operations 
              against your digital twin without risking production systems.
            </p>
            <div className="space-y-3">
              {redTeamCapabilities.slice(0, 4).map((capability, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Attack Simulation Capabilities</h3>
              <div className="space-y-3">
                {redTeamCapabilities.slice(4).map((capability, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-[#cc0c1a] flex-shrink-0" />
                    <span className="text-sm">{capability}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">How O-RANGE Works</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Capture", description: "Record network traffic from your OT environment or import existing PCAP files" },
            { step: "2", title: "Analyze", description: "O-RANGE automatically identifies devices, protocols, and communication patterns" },
            { step: "3", title: "Generate", description: "Build digital twin simulators that respond like your real infrastructure" },
            { step: "4", title: "Attack", description: "Run red team scenarios, penetration tests, and security training exercises" },
          ].map((item, index) => (
            <Card key={index} className="border-border/50 text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-[#cc0c1a] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-[#cc0c1a]/10 to-muted/30 border border-border/50">
        <Cpu className="h-12 w-12 text-[#cc0c1a] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Build Your Digital Twin Today</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Got a PCAP? Turn it into a fully functional OT simulator in minutes. 
          Stop guessing about your security posture — test it with O-RANGE.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
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

export default Orange;
