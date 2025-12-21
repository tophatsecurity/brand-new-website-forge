
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { 
  CircuitBoard, 
  Search, 
  Link2, 
  Shield, 
  FileSearch, 
  Cpu, 
  HardDrive, 
  Network, 
  AlertTriangle,
  CheckCircle,
  Layers,
  Zap,
  Target,
  Eye,
  Binary,
  Workflow
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OnboardProduct = () => {
  useScrollToTop();

  const coreCapabilities = [
    {
      icon: CircuitBoard,
      title: "Board-Level Forensics",
      description: "Deep inspection of PCBs, ASICs, FPGAs, and microcontrollers for unauthorized modifications, counterfeit components, and hardware trojans."
    },
    {
      icon: Link2,
      title: "Chain Enumeration",
      description: "Complete mapping of supply chain from raw materials to finished product, identifying every vendor, manufacturer, and handler in the chain."
    },
    {
      icon: FileSearch,
      title: "Firmware Extraction & Analysis",
      description: "Extract and analyze firmware from flash chips, EEPROMs, and embedded systems to detect backdoors and malicious code."
    },
    {
      icon: Binary,
      title: "Component Authentication",
      description: "Verify authenticity of ICs, chips, and electronic components against manufacturer specifications and known counterfeits."
    },
    {
      icon: Workflow,
      title: "Provenance Tracking",
      description: "Track component origins through multi-tier supply chains with cryptographic verification and chain-of-custody documentation."
    },
    {
      icon: Eye,
      title: "Visual & X-Ray Inspection",
      description: "Integration with visual inspection systems and X-ray analysis for non-destructive internal component examination."
    }
  ];

  const chainEnumerationFeatures = [
    "Multi-tier supplier mapping (Tier 1 through Tier N)",
    "Geographic origin tracking for components",
    "Vendor risk scoring and assessment",
    "Bill of Materials (BOM) verification",
    "Conflict mineral compliance checking",
    "ITAR/EAR export control verification",
    "Counterfeit risk assessment by component",
    "Historical incident tracking by supplier"
  ];

  const boardForensicsCapabilities = [
    {
      category: "Physical Analysis",
      items: [
        "PCB layer inspection and trace analysis",
        "Solder joint quality assessment",
        "Component placement verification",
        "Die marking and package authentication"
      ]
    },
    {
      category: "Electronic Analysis",
      items: [
        "JTAG/SWD interface discovery",
        "Debug port enumeration",
        "Signal integrity analysis",
        "Power consumption profiling"
      ]
    },
    {
      category: "Firmware Analysis",
      items: [
        "Flash memory extraction",
        "Bootloader analysis",
        "Cryptographic key discovery",
        "Hardcoded credential detection"
      ]
    },
    {
      category: "Supply Chain Verification",
      items: [
        "Component date code verification",
        "Lot traceability",
        "Manufacturing site identification",
        "Recycled/refurbished detection"
      ]
    }
  ];

  const useCases = [
    {
      title: "Defense & Aerospace",
      description: "Verify authenticity of mission-critical electronics before deployment in defense systems, satellites, and aircraft.",
      icon: Shield
    },
    {
      title: "Critical Infrastructure",
      description: "Ensure power grid, water treatment, and telecommunications equipment is free from supply chain compromise.",
      icon: Zap
    },
    {
      title: "Financial Services",
      description: "Validate hardware security modules (HSMs), payment terminals, and ATM components against tampering.",
      icon: Target
    },
    {
      title: "Healthcare & Medical",
      description: "Authenticate medical device components and ensure FDA compliance throughout the supply chain.",
      icon: CheckCircle
    }
  ];

  const comparisonData = [
    { feature: "Board-Level Analysis", onboard: true, traditional: false },
    { feature: "Multi-Tier Chain Mapping", onboard: true, traditional: false },
    { feature: "Firmware Extraction", onboard: true, traditional: false },
    { feature: "Component Authentication", onboard: true, traditional: "Limited" },
    { feature: "Counterfeit Detection", onboard: true, traditional: "Limited" },
    { feature: "Provenance Tracking", onboard: true, traditional: false },
    { feature: "Hardware Trojan Detection", onboard: true, traditional: false },
    { feature: "Cryptographic Verification", onboard: true, traditional: false },
  ];

  return (
    <MainLayout fullWidth paddingTop="none">
      {/* Hero Section */}
      <section className="hero-section pt-32 pb-16">
        <div className="hero-content">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#cc0c1a]/10 text-[#cc0c1a] px-4 py-2 rounded-full mb-6">
              <CircuitBoard className="w-5 h-5" />
              <span className="font-medium">Supply Chain Hardware Security</span>
            </div>
            <h1 className="hero-title mb-6">
              ONBOARD
            </h1>
            <p className="text-2xl text-muted-foreground mb-4">
              Supply Chain Board Forensics & Chain Enumeration
            </p>
            <p className="hero-description mb-8 max-w-3xl mx-auto">
              Deep hardware forensics platform that inspects circuit boards, enumerates complete supply chains, 
              and detects counterfeit components, hardware trojans, and unauthorized modifications before 
              they enter your critical systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-6 text-lg">
                  Request Hardware Assessment
                </Button>
              </Link>
              <Link to="/ddx">
                <Button variant="outline" className="px-8 py-6 text-lg border-[#cc0c1a] text-[#cc0c1a] hover:bg-[#cc0c1a] hover:text-white">
                  See Software Analysis (DDX)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What It Does */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What ONBOARD Does</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Complete visibility into hardware supply chains — from silicon to system deployment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCapabilities.map((capability, index) => (
              <Card key={index} className="border-l-4 border-l-[#cc0c1a] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#cc0c1a]/10 rounded-lg">
                      <capability.icon className="w-6 h-6 text-[#cc0c1a]" />
                    </div>
                    <CardTitle className="text-lg">{capability.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chain Enumeration Deep Dive */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                <Link2 className="inline w-8 h-8 mr-3 text-[#cc0c1a]" />
                Supply Chain Enumeration
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                ONBOARD maps your entire hardware supply chain from raw materials to finished product, 
                identifying every touchpoint where compromise could occur.
              </p>
              <ul className="space-y-3">
                {chainEnumerationFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Network className="w-6 h-6" />
                Chain Visibility Example
              </h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="p-3 bg-slate-700/50 rounded">
                  <span className="text-green-400">Tier 0:</span> Final Assembly → Acme Electronics (USA)
                </div>
                <div className="p-3 bg-slate-700/50 rounded ml-4">
                  <span className="text-yellow-400">Tier 1:</span> PCB Manufacturer → TechBoard Co (Taiwan)
                </div>
                <div className="p-3 bg-slate-700/50 rounded ml-8">
                  <span className="text-orange-400">Tier 2:</span> IC Supplier → ChipWorks Ltd (Malaysia)
                </div>
                <div className="p-3 bg-slate-700/50 rounded ml-12">
                  <span className="text-red-400">Tier 3:</span> Foundry → SemiCon Global (China)
                  <div className="text-red-300 text-xs mt-1">⚠ Risk Flag: Previous counterfeit incidents</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded ml-16">
                  <span className="text-purple-400">Tier 4:</span> Raw Silicon → MaterialSource (Japan)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board Forensics Capabilities */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <CircuitBoard className="inline w-8 h-8 mr-3 text-[#cc0c1a]" />
              Board Forensics Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive hardware inspection from physical layer to firmware
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardForensicsCapabilities.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-[#cc0c1a]">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#cc0c1a] mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industry Applications</h2>
            <p className="text-lg text-muted-foreground">
              Protecting critical hardware across sectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-[#cc0c1a]">
                <CardHeader>
                  <div className="mx-auto p-3 bg-[#cc0c1a]/10 rounded-full w-fit mb-2">
                    <useCase.icon className="w-8 h-8 text-[#cc0c1a]" />
                  </div>
                  <CardTitle>{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ONBOARD vs Traditional Inspection</h2>
            <p className="text-lg text-muted-foreground">
              Complete hardware supply chain visibility that goes beyond visual inspection
            </p>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Capability</TableHead>
                  <TableHead className="text-center">ONBOARD</TableHead>
                  <TableHead className="text-center">Traditional Methods</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center">
                      {row.onboard === true ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.onboard}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.traditional === true ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : row.traditional === false ? (
                        <span className="text-red-500">✗</span>
                      ) : (
                        <span className="text-yellow-600">{row.traditional}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Secure Your Hardware Supply Chain</h2>
          <p className="text-lg opacity-80 mb-8">
            Don't let counterfeit or compromised components reach your critical systems. 
            Get complete visibility with ONBOARD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-white text-slate-900 hover:bg-gray-200 px-8 py-6 text-lg">
                Schedule Hardware Assessment
              </Button>
            </Link>
            <Link to="/ddx">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg">
                Explore Software Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default OnboardProduct;
