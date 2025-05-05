
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Search, Server, Database, Link, FileCheck, Code, Cpu, HardDrive } from "lucide-react";

const SecondLookSection = () => {
  const features = [
    {
      title: "Passive Monitoring",
      description: "Constantly monitors your systems without impacting performance or requiring invasive installations.",
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
    {
      title: "Early Detection",
      description: "Find potential compromises that remain undetected for an average of 24 months with conventional systems.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Asset Discovery",
      description: "Automatically discovers your internet footprint and all connected assets.",
      icon: <Search className="h-8 w-8 text-primary" />,
    },
    {
      title: "Cloud Service",
      description: "No additional hardware or software purchases required. Deploy quickly with minimal overhead.",
      icon: <Server className="h-8 w-8 text-primary" />,
    },
    {
      title: "Intelligence Data",
      description: "Collects intelligence from the dark web and 600+ sources to identify potential threats.",
      icon: <Database className="h-8 w-8 text-primary" />,
    },
    {
      title: "Supply Chain Monitoring",
      description: "Monitor your suppliers for potential vulnerabilities that could affect your security.",
      icon: <Link className="h-8 w-8 text-primary" />,
    },
  ];

  const sbomFeatures = [
    {
      title: "Software Bill of Materials (SBOM)",
      description: "Comprehensive analysis of all software components, dependencies, and vulnerabilities in your supply chain.",
      icon: <Code className="h-8 w-8 text-primary" />,
    },
    {
      title: "Hardware Bill of Materials (HBOM)",
      description: "Detailed inventory of all hardware components with risk assessment for each element in your products.",
      icon: <Cpu className="h-8 w-8 text-primary" />,
    },
    {
      title: "Firmware Bill of Materials (FWBOM)",
      description: "Deep inspection of firmware components to identify potential backdoors and security risks.",
      icon: <HardDrive className="h-8 w-8 text-primary" />,
    },
    {
      title: "Cross-Domain BOM (XBOM)",
      description: "Unified view across software, hardware, and firmware for complete supply chain transparency.",
      icon: <FileCheck className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <Badge className="mb-4">Security Service</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">SecondLook X</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A simple, cost-effective solution that provides passive monitoring and automated alerts 
            for security vulnerabilities and compromises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="prose prose-lg max-w-none animate-slide-up opacity-0" style={{ animationDelay: '200ms' }}>
            <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
            <p className="text-muted-foreground">
              Hackers are breaking into organizations <span className="text-primary font-semibold">65% of the time</span>, 
              with the majority of attacks remaining undetected for 
              <span className="text-primary font-semibold"> 24 months</span> on average, 
              despite existing detection systems.
            </p>
            <p className="text-muted-foreground">
              Think about how much damage could be done if cyber criminals had undetected access to your 
              business's confidential information for as long as 2 years!
            </p>
            <p className="text-muted-foreground">
              Traditional anti-virus solutions are only <span className="text-primary font-semibold">40% effective</span> at best, 
              leaving significant gaps in your security posture.
            </p>
          </div>

          <div className="prose prose-lg max-w-none animate-slide-up opacity-0" style={{ animationDelay: '400ms' }}>
            <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
            <p className="text-muted-foreground">
              SecondLook X is a security data mart as a service that provides your business with:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Passive monitoring of your network traffic</li>
              <li>Automated email notifications when suspicious activity is detected</li>
              <li>Intelligence alerts tailored to your specific security needs</li>
              <li>Detection of malware that bypasses traditional proxies</li>
              <li>Comprehensive visibility of your internet footprint</li>
            </ul>
            <p className="text-muted-foreground">
              With your subscription, you'll receive Tophat Security tailored intelligence alerts to stay ahead of potential threats.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-8 text-center animate-slide-up opacity-0" style={{ animationDelay: '600ms' }}>
          Key Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="animate-slide-up opacity-0 border-t-4 border-primary" 
                  style={{ animationDelay: `${index * 100 + 700}ms` }}>
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-16 animate-slide-up opacity-0" style={{ animationDelay: '1300ms' }}>
          <Badge className="mb-4">BOM Intelligence</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">SecondLook XBOM Platform</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A comprehensive bill of materials intelligence platform for software, hardware, and firmware components
            in your supply chain.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="prose prose-lg max-w-none animate-slide-up opacity-0" style={{ animationDelay: '1400ms' }}>
            <h3 className="text-2xl font-bold mb-4">Supply Chain Visibility</h3>
            <p className="text-muted-foreground">
              In today's complex supply chains, <span className="text-primary font-semibold">more than 70%</span> of product components 
              come from third-party suppliers. Without proper visibility, these components represent a significant security risk.
            </p>
            <p className="text-muted-foreground">
              The SecondLook XBOM Platform provides comprehensive visibility across all components in your 
              supply chain, helping you identify and mitigate risks before they impact your business.
            </p>
          </div>

          <div className="prose prose-lg max-w-none animate-slide-up opacity-0" style={{ animationDelay: '1500ms' }}>
            <h3 className="text-2xl font-bold mb-4">BOM Intelligence</h3>
            <p className="text-muted-foreground">
              Our platform analyzes bills of materials across four key domains:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Software components and dependencies (SBOM)</li>
              <li>Hardware components and suppliers (HBOM)</li>
              <li>Firmware versions and vulnerabilities (FWBOM)</li>
              <li>Cross-domain relationships and security impacts (XBOM)</li>
            </ul>
            <p className="text-muted-foreground">
              This comprehensive approach ensures no vulnerability goes undetected in your product ecosystem.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {sbomFeatures.map((feature, index) => (
            <Card key={index} className="animate-slide-up opacity-0 border-t-4 border-primary" 
                  style={{ animationDelay: `${index * 100 + 1600}ms` }}>
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-secondary/50 p-8 rounded-lg text-center animate-slide-up opacity-0" 
             style={{ animationDelay: '2000ms' }}>
          <h3 className="text-2xl font-bold mb-4">Ready to secure your business?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Please contact us for more information about subscriptions, OEM opportunities, and partnerships.
          </p>
          <Button size="lg" asChild>
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SecondLookSection;
