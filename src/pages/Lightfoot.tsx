import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CheckCircle2,
  Server,
  Terminal,
  Globe,
  FileText,
  Camera,
  Activity,
  Target,
  Users,
  Building,
  Factory,
  Droplets,
  Fuel,
  FlaskConical,
  Train,
  X,
  Check,
  Monitor
} from 'lucide-react';

const Lightfoot = () => {
  useScrollToTop();
  
  const protocols = [
    { name: "Modbus (TCP, RTU, ASCII)", category: "Factory Automation" },
    { name: "Siemens S7", category: "PLCs & Controllers" },
    { name: "BACnet (IP, MSTP, SC)", category: "Building Automation" },
    { name: "DNP3 (TCP, UDP)", category: "Electric Utilities & SCADA" },
    { name: "EtherNet/IP (CIP)", category: "Industrial Ethernet" },
    { name: "Profinet/Profibus", category: "Process Automation" },
    { name: "OPC UA/DA", category: "Industrial Data Exchange" },
    { name: "IEC 61850", category: "Electrical Substation" },
    { name: "IEC 104", category: "Power System Control" },
    { name: "HART-IP", category: "Process Control" },
  ];

  const coreCapabilities = [
    {
      icon: <Network className="h-6 w-6" />,
      title: "Multi-Protocol Industrial Scanning",
      description: "Supports 40+ industrial protocols including Modbus, Siemens S7, BACnet, DNP3, EtherNet/IP, and more."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Active Security Assessment",
      description: "Protocol fingerprinting, vulnerability detection, service discovery, and complete asset inventory."
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Network Analysis",
      description: "Real-time packet capture with tcpdump/tshark, full protocol dissection, and traffic analysis."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Comprehensive Reporting",
      description: "HTML, PDF, JSON, DOCX formats with CVE references, severity ratings, and remediation guidance."
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "Dual Interface",
      description: "Modern Web UI dashboard for interactive use, plus CLI mode for automation and scripting."
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Screenshot Capture",
      description: "Automatically captures web interfaces of discovered devices for documentation."
    }
  ];

  const criticalInfrastructure = [
    { icon: <Zap className="h-6 w-6" />, name: "Power Plants & Electrical Grids" },
    { icon: <Droplets className="h-6 w-6" />, name: "Water Treatment Facilities" },
    { icon: <Factory className="h-6 w-6" />, name: "Manufacturing Plants" },
    { icon: <Fuel className="h-6 w-6" />, name: "Oil & Gas Refineries" },
    { icon: <FlaskConical className="h-6 w-6" />, name: "Chemical Plants" },
    { icon: <Building className="h-6 w-6" />, name: "Building Management Systems" },
    { icon: <Train className="h-6 w-6" />, name: "Transportation Systems" },
  ];

  const useCases = [
    {
      title: "Pre-Assessment Reconnaissance",
      items: ["Discover unknown OT assets", "Map network topology", "Identify vulnerable devices", "Prioritize remediation efforts"]
    },
    {
      title: "Vulnerability Management",
      items: ["Regular scanning for new vulnerabilities", "Track patching progress", "Verify security controls", "Document security posture"]
    },
    {
      title: "Incident Response",
      items: ["Rapid asset enumeration during incidents", "Protocol traffic analysis", "Compromise indicator detection", "Network segmentation verification"]
    },
    {
      title: "Compliance Audits",
      items: ["Generate evidence for auditors", "Demonstrate security controls", "Track remediation progress", "Document network architecture"]
    }
  ];

  const targetUsers = [
    { icon: <Eye className="h-5 w-5" />, title: "Security Operations Centers (SOCs)", description: "Monitor OT/ICS environments, detect anomalies, respond to incidents" },
    { icon: <Shield className="h-5 w-5" />, title: "OT Security Teams", description: "Assess industrial network security, perform vulnerability management" },
    { icon: <Target className="h-5 w-5" />, title: "Penetration Testers", description: "Conduct authorized assessments, identify attack paths" },
    { icon: <FileSearch className="h-5 w-5" />, title: "Compliance Officers", description: "Generate audit reports, track security improvements" },
    { icon: <AlertTriangle className="h-5 w-5" />, title: "Incident Responders", description: "Rapidly assess compromised networks, support forensic investigations" },
  ];

  const threatsDetected = [
    "Exposed Internet-facing ICS: PLCs accessible from the internet",
    "Default Credentials: Unchanged factory passwords on critical systems",
    "Outdated Firmware: Devices with known exploitable vulnerabilities",
    "Protocol Weaknesses: Unencrypted communications, lack of authentication",
    "Configuration Errors: Overly permissive access controls",
    "Rogue Devices: Unauthorized equipment on OT networks"
  ];

  return (
    <MainLayout containerClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
          OT/ICS/DCS Security Scanner
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">LIGHTFOOT</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Comprehensive security scanning for Operational Technology, Industrial Control Systems, and Distributed Control Systems
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          40+ industrial protocols • OT-aware scanning • Safe for critical infrastructure
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

      {/* Key Stats */}
      <div className="mb-16">
        <Card className="bg-gradient-to-br from-muted/50 to-background border-border/50">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#cc0c1a] mb-2">40+</div>
                <div className="text-muted-foreground">Industrial Protocols</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#cc0c1a] mb-2">156</div>
                <div className="text-muted-foreground">Scanner Modules</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#cc0c1a] mb-2">4</div>
                <div className="text-muted-foreground">Report Formats</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#cc0c1a] mb-2">Safe</div>
                <div className="text-muted-foreground">OT-Aware Scanning</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Capabilities */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Purpose-built for operational technology environments where availability and safety are paramount.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreCapabilities.map((capability, index) => (
            <Card key={index} className="border-border/50 hover:border-[#cc0c1a]/30 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#cc0c1a]/10 flex items-center justify-center text-[#cc0c1a] mb-4">
                  {capability.icon}
                </div>
                <CardTitle className="text-lg">{capability.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{capability.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dual Interface */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Dual Interface</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-[#cc0c1a]" />
                <CardTitle>Web UI Dashboard</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Modern dashboard for interactive scanning and management</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#cc0c1a]" /> Real-time scan monitoring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#cc0c1a]" /> Interactive results visualization</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#cc0c1a]" /> Report management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#cc0c1a]" /> Scan scheduling</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#cc0c1a]" /> Configuration management</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Terminal className="h-8 w-8 text-[#cc0c1a]" />
                <CardTitle>CLI Mode</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Command-line interface for automation and scripting</p>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                <code className="text-foreground">
                  lightfoot --targets 192.168.1.0/24 --protocols modbus,s7,bacnet
                </code>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Perfect for CI/CD pipelines, scheduled scans, and integration with existing security workflows.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Protocol Support */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">40+ Industrial Protocol Support</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            LIGHTFOOT speaks the language of industrial systems with native protocol understanding.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {protocols.map((protocol, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
              <span className="font-medium">{protocol.name}</span>
              <Badge variant="secondary" className="text-xs">{protocol.category}</Badge>
            </div>
          ))}
          <div className="flex items-center justify-center p-3 rounded-lg border border-dashed border-[#cc0c1a]/30 text-[#cc0c1a]">
            + 30 more specialized protocols
          </div>
        </div>
      </section>

      {/* Why LIGHTFOOT Exists */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">The OT/ICS Security Challenge</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Industrial control systems designed 20-40 years ago without cybersecurity are now connected to networks, creating massive security gaps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#cc0c1a]" />
                Critical Infrastructure at Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {criticalInfrastructure.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-[#cc0c1a]">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#cc0c1a]" />
                Compliance Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">LIGHTFOOT helps organizations assess compliance and identify gaps for:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">NERC CIP</Badge>
                <Badge variant="outline">IEC 62443</Badge>
                <Badge variant="outline">NIST CSF</Badge>
                <Badge variant="outline">ISA/IEC 62443</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/30 border-border/50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Why Traditional IT Scanners Fail</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background border border-border/50">
                <p className="font-medium mb-2 text-muted-foreground">IT Scanner (Nmap/Nessus)</p>
                <p className="text-sm">"Port 502 open"</p>
              </div>
              <div className="p-4 rounded-lg bg-[#cc0c1a]/5 border border-[#cc0c1a]/20">
                <p className="font-medium mb-2 text-[#cc0c1a]">LIGHTFOOT</p>
                <p className="text-sm">"Modbus TCP, Schneider M340 PLC v3.2, 47 holding registers exposed, default config detected"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Comparison Table */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Key Differentiators</h2>
        </div>
        <Tabs defaultValue="it-scanners" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="it-scanners">vs. IT Security Scanners</TabsTrigger>
            <TabsTrigger value="ot-tools">vs. Commercial OT Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="it-scanners">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Feature</TableHead>
                      <TableHead className="w-1/3">IT Scanners (Nmap/Nessus)</TableHead>
                      <TableHead className="w-1/3">LIGHTFOOT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Industrial Protocols</TableCell>
                      <TableCell><X className="h-4 w-4 text-destructive" /> No understanding</TableCell>
                      <TableCell><Check className="h-4 w-4 text-green-500" /> 40+ protocols</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Safe Scanning</TableCell>
                      <TableCell><AlertTriangle className="h-4 w-4 text-yellow-500" /> May crash OT devices</TableCell>
                      <TableCell><Check className="h-4 w-4 text-green-500" /> OT-aware, gentle</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Protocol Details</TableCell>
                      <TableCell><X className="h-4 w-4 text-destructive" /> Port only</TableCell>
                      <TableCell><Check className="h-4 w-4 text-green-500" /> Full protocol analysis</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">OT Vulnerabilities</TableCell>
                      <TableCell><AlertTriangle className="h-4 w-4 text-yellow-500" /> Generic checks</TableCell>
                      <TableCell><Check className="h-4 w-4 text-green-500" /> OT-specific CVEs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Compliance Mapping</TableCell>
                      <TableCell><X className="h-4 w-4 text-destructive" /> None</TableCell>
                      <TableCell><Check className="h-4 w-4 text-green-500" /> ICS standards</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ot-tools">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Feature</TableHead>
                      <TableHead className="w-1/3">Commercial Tools</TableHead>
                      <TableHead className="w-1/3">LIGHTFOOT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Cost</TableCell>
                      <TableCell>$$$$ Enterprise licensing</TableCell>
                      <TableCell>Flexible licensing</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Deployment</TableCell>
                      <TableCell>Complex agent-based</TableCell>
                      <TableCell>Standalone executable</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Protocol Coverage</TableCell>
                      <TableCell>20-30 protocols</TableCell>
                      <TableCell>40+ protocols</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Reporting</TableCell>
                      <TableCell>Good</TableCell>
                      <TableCell>4 formats (HTML, PDF, JSON, DOCX)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Flexibility</TableCell>
                      <TableCell>Vendor lock-in</TableCell>
                      <TableCell>Self-contained, portable</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Use Cases */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {useCase.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-[#cc0c1a] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Threats Detected */}
      <section className="mb-16">
        <Card className="bg-[#cc0c1a]/5 border-[#cc0c1a]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#cc0c1a]" />
              Threats LIGHTFOOT Helps Detect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {threatsDetected.map((threat, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Shield className="h-4 w-4 text-[#cc0c1a] flex-shrink-0 mt-0.5" />
                  <span>{threat}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-background rounded-lg border border-border/50">
              <h4 className="font-semibold mb-2">Real-World Attack Context</h4>
              <p className="text-sm text-muted-foreground">
                Colonial Pipeline (2021), Ukraine Power Grid (2015, 2016), Triton/TRISIS (2017), Stuxnet (2010) — 
                LIGHTFOOT helps organizations identify the attack surface before adversaries do.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Target Users */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Who Uses LIGHTFOOT</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetUsers.map((user, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#cc0c1a]/10 flex items-center justify-center text-[#cc0c1a] flex-shrink-0">
                    {user.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{user.title}</h3>
                    <p className="text-xs text-muted-foreground">{user.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Technical Innovation</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Architecture Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Cpu className="h-4 w-4 text-[#cc0c1a]" /> Python-based: Cross-platform, extensible</li>
                <li className="flex items-center gap-2"><Settings className="h-4 w-4 text-[#cc0c1a]" /> Modular Protocols: 156 scanner modules</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#cc0c1a]" /> Async Scanning: Rate-limited to avoid disruption</li>
                <li className="flex items-center gap-2"><Network className="h-4 w-4 text-[#cc0c1a]" /> Deep packet integration with tcpdump/tshark</li>
                <li className="flex items-center gap-2"><Server className="h-4 w-4 text-[#cc0c1a]" /> FastAPI + Uvicorn REST API</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Deployment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Linux</span>
                  <Badge variant="secondary">RPM Package</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Windows</span>
                  <Badge variant="secondary">Inno Setup Installer</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Debian/Ubuntu</span>
                  <Badge variant="secondary">DEB Package</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Portable</span>
                  <Badge variant="secondary">Standalone Executable</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-[#cc0c1a]/10 to-muted/30 border border-border/50">
        <Shield className="h-12 w-12 text-[#cc0c1a] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Secure Your Industrial Network Today</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Don't wait for a breach to discover what's on your OT network. Get complete visibility with LIGHTFOOT.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Built by Tophat Security, Inc. — Understanding both cybersecurity and operational technology.
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

export default Lightfoot;
