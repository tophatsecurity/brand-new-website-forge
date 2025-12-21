
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
  Database,
  Ship,
  Car,
  Gauge,
  Monitor,
  Server,
  GraduationCap,
  Users,
  FlaskRound,
  BookOpen
} from 'lucide-react';

const Orange = () => {
  useScrollToTop();

  const stats = [
    { value: "7", label: "Industrial Facilities", desc: "Nuclear, Coal, Hydro, Oil, Rail, Navy, Auto" },
    { value: "71", label: "Emulated Devices", desc: "28 PLCs, 21 HMIs, 21 RTUs, 1 Historian" },
    { value: "101", label: "Industrial Protocols", desc: "Modbus, DNP3, S7, OPC UA, BACnet, etc." },
    { value: "101", label: "REST API Endpoints", desc: "Complete control via API" },
  ];

  const facilities = [
    { icon: <Zap className="h-8 w-8" />, title: "Power Plants", types: ["Nuclear", "Coal", "Hydro"], desc: "Full power generation simulation with turbines, generators, and grid controls" },
    { icon: <FlaskConical className="h-8 w-8" />, title: "Oil Pumping Stations", types: ["Refineries", "Pipelines"], desc: "Pump controls, flow meters, pressure systems, and SCADA" },
    { icon: <Train className="h-8 w-8" />, title: "Railroad Yard Signaling", types: ["Signals", "Switches"], desc: "Track switching, signal controls, and yard management systems" },
    { icon: <Ship className="h-8 w-8" />, title: "Navy Ship Control", types: ["Propulsion", "Navigation"], desc: "Ship propulsion, navigation, and onboard control systems" },
    { icon: <Car className="h-8 w-8" />, title: "Car Assembly Plants", types: ["Robotics", "Conveyors"], desc: "Assembly line automation with robots and quality control" },
  ];

  const deviceBreakdown = [
    { type: "PLCs", count: 28, desc: "Programmable Logic Controllers from Siemens, Allen-Bradley, Schneider, etc." },
    { type: "HMIs", count: 21, desc: "Human Machine Interfaces for operator visualization" },
    { type: "RTUs", count: 21, desc: "Remote Terminal Units for distributed I/O" },
    { type: "Historian", count: 1, desc: "Industrial data storage and trending" },
  ];

  const protocols = [
    "Modbus TCP/RTU", "DNP3", "S7comm", "OPC UA", "OPC DA", "BACnet", 
    "EtherNet/IP", "CIP", "Profinet", "Profibus", "IEC 61850", "IEC 104",
    "HART-IP", "FINS", "MELSEC", "GE SRTP", "CODESYS"
  ];

  const useCases = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Cybersecurity Training",
      description: "Train red teams (attackers) and blue teams (defenders) on realistic ICS environments. Practice incident response without risking real infrastructure.",
      benefits: ["Hands-on learning", "Safe environment", "Realistic scenarios"]
    },
    {
      icon: <FlaskRound className="h-6 w-6" />,
      title: "Security Research",
      description: "Test vulnerabilities safely, develop security tools, and analyze industrial malware like Stuxnet in an isolated environment.",
      benefits: ["Malware analysis", "Tool development", "Vulnerability testing"]
    },
    {
      icon: <Crosshair className="h-6 w-6" />,
      title: "Penetration Testing",
      description: "Practice ICS-specific attack techniques before client engagements. Validate tools and methodologies in realistic environments.",
      benefits: ["Pre-engagement prep", "Tool validation", "Technique practice"]
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Education & Certification",
      description: "University courses on critical infrastructure protection. ICS security certifications (GICSP, etc.) and vendor training programs.",
      benefits: ["Academic courses", "Certification prep", "Vendor training"]
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      title: "Product Development",
      description: "Test SIEM integrations with ICS protocols, develop IDS/IPS signatures, and validate security product effectiveness.",
      benefits: ["SIEM testing", "Signature development", "Product validation"]
    },
  ];

  const whyItExists = [
    { problem: "Real systems can't be used for training", solution: "O-RANGE provides safe, realistic alternatives" },
    { problem: "OT security skills gap in the industry", solution: "Hands-on training environment for professionals" },
    { problem: "IT security skills don't apply to OT", solution: "Learn OT-specific protocols and attack techniques" },
    { problem: "Critical infrastructure under attack", solution: "Practice defense before real incidents occur" },
  ];

  const keyBenefits = [
    { emoji: "✅", text: "Safe — Break things without consequences" },
    { emoji: "✅", text: "Realistic — Authentic protocols and device behavior" },
    { emoji: "✅", text: "Cost-Effective — No hardware needed, runs in containers" },
    { emoji: "✅", text: "Fast — Deploy in minutes, not months" },
    { emoji: "✅", text: "Repeatable — Practice the same scenario multiple times" },
    { emoji: "✅", text: "Comprehensive — Complete facilities, not just single devices" },
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
    <MainLayout fullWidth paddingTop="none">
      {/* Hero Section */}
      <section className="hero-section pt-32 pb-16">
        <div className="hero-content">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
              <Factory className="w-4 h-4 mr-1 inline" /> OT/ICS Emulation Platform
            </Badge>
            <h1 className="hero-title mb-4">O-RANGE™</h1>
            <p className="text-2xl text-muted-foreground mb-2">
              Operational Technologies Range & Emulator
            </p>
            <p className="text-xl text-[#cc0c1a] font-medium mb-6">
              Like a flight simulator for critical infrastructure security
            </p>
            <p className="hero-description mb-8 max-w-3xl mx-auto">
              Practice protecting power plants, oil refineries, railroad systems, and naval ships 
              in a safe, virtual environment. Create realistic ICS/OT simulations from real-world 
              packet captures — no hardware required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-6 text-lg">
                  Request a Demo
                </Button>
              </Link>
              <Link to="/lightfoot">
                <Button variant="outline" className="px-8 py-6 text-lg border-[#cc0c1a] text-[#cc0c1a] hover:bg-[#cc0c1a] hover:text-white">
                  See LIGHTFOOT Scanner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-[#cc0c1a] mb-2">{stat.value}</div>
                <div className="text-lg font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Analogy */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Why O-RANGE Exists</h2>
          <div className="bg-background rounded-xl p-8 shadow-lg border">
            <p className="text-xl mb-6">
              You can't practice protecting critical infrastructure on the real thing.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                <div className="text-red-600 font-medium mb-2">❌ The Wrong Way</div>
                <p className="text-muted-foreground">Learning to fly by reading a manual — or testing OT security on live production systems</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                <div className="text-green-600 font-medium mb-2">✅ The O-RANGE Way</div>
                <p className="text-muted-foreground">Learning to fly in a flight simulator — realistic, safe, and repeatable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulated Facilities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🏭 Simulate 7 Types of Industrial Facilities</h2>
            <p className="text-lg text-muted-foreground">Complete, realistic environments for security training and testing</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="border-l-4 border-l-[#cc0c1a] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#cc0c1a]/10 rounded-lg text-[#cc0c1a]">
                      {facility.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{facility.title}</CardTitle>
                      <div className="flex gap-1 mt-1">
                        {facility.types.map((type, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{type}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{facility.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emulated Devices */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">⚙️ 71 Real Industrial Devices Emulated</h2>
            <p className="text-lg text-muted-foreground">Authentic device behavior and protocol responses</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {deviceBreakdown.map((device, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-[#cc0c1a] mb-2">{device.count}</div>
                  <div className="text-lg font-medium mb-2">{device.type}</div>
                  <p className="text-sm text-muted-foreground">{device.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">📡 101 Industrial Protocols Supported</h2>
            <p className="text-lg text-muted-foreground">Real protocols used in actual factories and power plants</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {protocols.map((protocol, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1.5 text-sm">
                {protocol}
              </Badge>
            ))}
            <Badge variant="outline" className="px-3 py-1.5 text-sm border-[#cc0c1a] text-[#cc0c1a]">
              + 84 more protocols
            </Badge>
          </div>
        </div>
      </section>

      {/* PCAP to Simulator */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
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
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What O-RANGE Enables</h2>
            <p className="text-lg text-muted-foreground">From training to product development — one platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#cc0c1a]/10 rounded-lg text-[#cc0c1a]">
                      {useCase.icon}
                    </div>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{useCase.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {useCase.benefits.map((benefit, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{benefit}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Benefits</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {keyBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                <span className="text-xl">{benefit.emoji}</span>
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interfaces */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🔧 Complete Control</h2>
            <p className="text-lg text-muted-foreground">Multiple interfaces for every use case</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Monitor className="h-12 w-12 text-[#cc0c1a] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Web UI</h3>
                <p className="text-muted-foreground text-sm">Modern dashboard for real-time monitoring, scenario management, and visualization</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Server className="h-12 w-12 text-[#cc0c1a] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">REST API</h3>
                <p className="text-muted-foreground text-sm">101 endpoints with Swagger/OpenAPI documentation for automation</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Cpu className="h-12 w-12 text-[#cc0c1a] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">CLI & TUI</h3>
                <p className="text-muted-foreground text-sm">Command-line and terminal interfaces for scripting and headless operation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Real World Scenarios */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real-World Training Scenarios</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-[#cc0c1a] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">Utility Company Training</h3>
                <p className="text-gray-300 text-sm">
                  Train operators on responding to cyberattacks on power grids — practice incident response without risking actual blackouts.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6">
                <FlaskRound className="h-8 w-8 text-[#cc0c1a] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">Security Research</h3>
                <p className="text-gray-300 text-sm">
                  Study how industrial malware spreads through networks and develop detection signatures before it hits real systems.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6">
                <Target className="h-8 w-8 text-[#cc0c1a] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">Penetration Testing</h3>
                <p className="text-gray-300 text-sm">
                  Practice attacking ICS systems before conducting assessments at client facilities, understanding OT-specific risks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="py-12 bg-[#cc0c1a] text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-2xl font-bold">
            "Practice protecting critical infrastructure in a safe environment before you need to do it in production."
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Factory className="h-16 w-16 text-[#cc0c1a] mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">O-RANGE: Where ICS Security Professionals are Made, Not Born</h2>
          <p className="text-lg text-muted-foreground mb-8">
            In a world where attacks on power plants, water systems, and transportation networks are real and increasing, 
            O-RANGE provides the training ground that security professionals desperately need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-6 text-lg">
                Schedule a Demo
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="px-8 py-6 text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Orange;
