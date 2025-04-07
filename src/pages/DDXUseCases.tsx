
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Database, Radio, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

const DDXUseCases = () => {
  const useCases = [
    {
      id: 1,
      title: "Prime Suppliers Testing N Tier",
      challenge: "Prime Supplier needs to address security of their end-to-end hardware supply chain. Customers have reported network card firmware has indicators of compromise. Network cards from sub-supplier need security verification of components' security.",
      solution: [
        { module: "AI VISION", description: "Artificial Intelligence visual inspection automatically reviews board components" },
        { module: "TRUSTTREE", description: "Board hardware components and sourcing are reviewed for compromises" },
        { module: "CORRELATION", description: "Risk discovery in hardware supply chain" },
        { module: "FIRMWARE", description: "Firmware module automatically decompiles and tests firmware" },
        { module: "REPORT-HBOM", description: "Hardware Bill of Materials" }
      ],
      outcome: "DDX provided Prime Supplier timely alerting of hardware supply chain security threats",
      icon: <Cpu className="h-12 w-12 text-[#cc0c1a]" />
    },
    {
      id: 2,
      title: "Defense Agency",
      challenge: "Agency has external indicators of server motherboards being compromised. Server manufacturer declares that motherboards are safe. Agency needs to review server motherboards to check for compromise.",
      solution: [
        { module: "AI VISION", description: "Artificial Intelligence visual inspection automatically reviews motherboards" },
        { module: "NETBOOTER", description: "Server hardware is connected in place to test hardware and boot" },
        { module: "CORRELATION", description: "Risk discovery in hardware supply chain" },
        { module: "FIRMWARE", description: "Software module automatically decompiles software and firmware" }
      ],
      outcome: "DDX detected implant installed on mother board which contained nation state malware.",
      icon: <Shield className="h-12 w-12 text-[#cc0c1a]" />
    },
    {
      id: 3,
      title: "Defense Industrial Base (DIB)",
      challenge: "Supplier was recently compromised and has assured DIB entity of no compromise. Regulatory mandate for maintaining and verifying secure software supply chain. DIB needs independent supply chain verification of widely deployed software.",
      solution: [
        { module: "TRUSTTREE", description: "Supply Chain Verification" },
        { module: "CORRELATION", description: "Risk Discovery in Software Supply Chain" },
        { module: "TIMEMACHINE", description: "Elastic Sandbox (Time Machine) for extensive testing" },
        { module: "REPORT-SBOM", description: "Independent Software Bill of Materials" }
      ],
      outcome: "DDX provided DIB independent verification of software supply chain",
      icon: <Database className="h-12 w-12 text-[#cc0c1a]" />
    },
    {
      id: 4,
      title: "Critical Infrastructure (CI) – O&G",
      challenge: "Critical Infrastructure entity experienced physical fault with RF connected equipment. Company policy to determine root cause due to physical shutdown.",
      solution: [
        { module: "RFVISION", description: "Radio Frequency deployed and tested" },
        { module: "TRUSTTREE", description: "Supply Chain Verification" },
        { module: "FIRMWARE", description: "Firmware analysis of radio system" },
        { module: "REPORT", description: "Zero-day vulnerability and exploit found and reported" }
      ],
      outcome: "CI entity determined to change radio hardware due to firmware supply chain risk identified by DDX",
      icon: <Radio className="h-12 w-12 text-[#cc0c1a]" />
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="mb-12">
            <Link to="/ddx" className="inline-flex items-center text-[#cc0c1a] hover:text-[#a80916] mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DDX Overview
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">DDX Use Cases</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Real-world examples of how DDX has been deployed to solve critical cybersecurity challenges across different industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase) => (
              <Card key={useCase.id} className="border-t-0 border-l-4 border-[#cc0c1a] bg-background text-foreground shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    {useCase.icon}
                    <CardTitle>Use Case {useCase.id}: {useCase.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Challenge</h3>
                    <p className="text-muted-foreground">{useCase.challenge}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Solution</h3>
                    <ul className="space-y-2">
                      {useCase.solution.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-28 font-medium text-[#cc0c1a]">Module {item.module}</span>
                          <span className="flex-1">{item.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Outcome</h3>
                    <p className="text-muted-foreground font-medium">{useCase.outcome}</p>
                  </div>
                  
                  <div className="pt-4 text-xs text-muted-foreground italic">
                    TOPHAT SECURITY CONFIDENTIAL
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-6">Discover How DDX Can Secure Your Supply Chain</h2>
            <Link to="/contact">
              <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                Request a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DDXUseCases;
