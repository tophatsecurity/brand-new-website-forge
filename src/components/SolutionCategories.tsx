
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Shield, 
  Factory, 
  ArrowRight, 
  Scan, 
  AlertTriangle, 
  Network,
  Target,
  Radio,
  Cpu
} from 'lucide-react';

const SolutionCategories = () => {
  const categories = [
    {
      icon: Brain,
      title: "AI Security",
      tagline: "Protect Your AI Systems",
      whatItDoes: [
        "Monitors GPU firmware, memory, and kernel-level operations in real-time",
        "Detects and blocks prompt injection, model extraction, and adversarial attacks",
        "Secures AI model weights, training data, and inference pipelines",
        "Prevents unauthorized AI model access and data exfiltration"
      ],
      products: [
        { name: "PARAGUARD", path: "/paraguard", desc: "AI-Native Endpoint Security" },
        { name: "SecondLook", path: "/secondlook", desc: "AI Forensics & Detection" }
      ],
      color: "from-purple-500/20 to-purple-600/10",
      iconColor: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Cyber Supply Chain Protection",
      tagline: "Secure Your Software Supply Chain",
      whatItDoes: [
        "Maps and visualizes all software dependencies with TrustTree analysis",
        "Identifies malicious packages, typosquatting, and compromised libraries",
        "Tracks threat actors targeting your supply chain with geo-location",
        "Continuous monitoring of third-party code for vulnerabilities and backdoors"
      ],
      products: [
        { name: "DDX", path: "/ddx", desc: "Software Composition Analysis" },
        { name: "ONBOARD", path: "/onboard", desc: "Hardware Board Forensics" }
      ],
      color: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-600"
    },
    {
      icon: Factory,
      title: "OT/ICS Simulation & Probes",
      tagline: "Assess & Simulate Industrial Networks",
      whatItDoes: [
        "Scans 40+ industrial protocols (Modbus, S7, BACnet, DNP3, OPC UA)",
        "Creates digital twins from real-world packet captures (PCAP to Simulator)",
        "Simulates factories, power plants, rail systems for red team exercises",
        "Safe vulnerability assessment without disrupting critical operations"
      ],
      products: [
        { name: "LIGHTFOOT", path: "/lightfoot", desc: "OT/ICS Security Scanner" },
        { name: "O-RANGE", path: "/orange", desc: "OT Network Digital Twin" },
        { name: "SEEKCAP", path: "/seekcap", desc: "Industrial Network Visibility" }
      ],
      color: "from-orange-500/20 to-orange-600/10",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Do We Protect?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Three specialized security domains. Purpose-built solutions. Complete protection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden border-2 hover:border-[#cc0c1a]/50 transition-all duration-300 hover:shadow-xl group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-50`} />
              <CardContent className="relative p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-white shadow-md ${category.iconColor}`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.tagline}</p>
                  </div>
                </div>

                {/* What it does */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#cc0c1a] uppercase tracking-wide mb-3">
                    What It Does
                  </h4>
                  <ul className="space-y-2">
                    {category.whatItDoes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#cc0c1a] mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Products */}
                <div className="border-t pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Solutions
                  </h4>
                  <div className="space-y-2">
                    {category.products.map((product, i) => (
                      <Link 
                        key={i} 
                        to={product.path}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/80 transition-colors group/link"
                      >
                        <div>
                          <span className="font-medium text-foreground">{product.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">— {product.desc}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/link:text-[#cc0c1a] group-hover/link:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-6 text-lg">
              Get a Security Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionCategories;
