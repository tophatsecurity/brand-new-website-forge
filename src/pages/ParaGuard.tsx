
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Cpu, Zap, Server, Database, ShieldCheck, CircleCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ParaGuard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="w-full md:w-1/2">
                <Badge variant="outline" className="bg-primary/10 text-primary mb-4">AI Security</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">ParaGuard</h1>
                <p className="text-xl text-gray-300 mb-8">
                  AI security detection & response for AI Edge and Hyperscale environments.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact">
                    <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                      Request a Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-center">
                  <Shield className="h-32 w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ParaGuard vs Traditional Security */}
        <div className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">ParaGuard vs. Traditional Security</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
              Unlike traditional EDR/XDR solutions, ParaGuard offers GPU-native security with deep AI workload monitoring.
            </p>
            
            <div className="overflow-x-auto mb-12">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Security Feature</TableHead>
                    <TableHead className="w-1/3">Traditional EDR/XDR</TableHead>
                    <TableHead className="w-1/3">ParaGuard AI D&R</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Kernel-Level Monitoring</TableCell>
                    <TableCell>CPU-focused, lacks GPU hooks</TableCell>
                    <TableCell className="text-primary">Includes GPU driver-level hooks</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GPU Firmware & Memory Security</TableCell>
                    <TableCell>No visibility</TableCell>
                    <TableCell className="text-primary">Detects firmware tampering & GPU memory corruption</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Application & AI Model Security</TableCell>
                    <TableCell>Limited</TableCell>
                    <TableCell className="text-primary">Identifies AI model inference and covert GPU processing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hypervisor & Shared Resource Protection</TableCell>
                    <TableCell>Partially covers VMs</TableCell>
                    <TableCell className="text-primary">Detects GPU-based escapes and hijacking</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Advanced Detection Capabilities */}
        <div className="py-16 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Advanced Detection Capabilities</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-background border-t-4 border-t-primary">
                <CardHeader>
                  <div className="mb-2">
                    <Cpu className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>eBPF + ParaGuard Synergy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Extends kernel-level security to GPUs, providing comprehensive system-wide protection.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background border-t-4 border-t-primary">
                <CardHeader>
                  <div className="mb-2">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Real-Time AI Model Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stops model manipulation, unauthorized inference changes, and adversarial AI attacks.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background border-t-4 border-t-primary">
                <CardHeader>
                  <div className="mb-2">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>GPU Rootkit & Malware Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Protects against stealthy GPU-based threats like Jellyfish Rootkit, CodeTalker, and TensorHack.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Deployment Models */}
        <div className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Deployment Models</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
              ParaGuard seamlessly integrates into enterprise and cloud environments, ensuring scalable GPU security.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-background">
                <CardHeader>
                  <div className="mb-2">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">EDR/XDR Extension</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Expands existing security platforms into GPU detection and response
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardHeader>
                  <div className="mb-2">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">MDR & Managed Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Fully managed AI infrastructure security
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardHeader>
                  <div className="mb-2">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">OEM & API Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Embedded GPU security for AI applications
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardHeader>
                  <div className="mb-2">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">IaaS Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Secure cloud AI workloads and confidential compute environments
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Response Lifecycle */}
        <div className="py-16 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6 text-center">ParaGuard in Action: Response Lifecycle</h2>
            
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="identify">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <CircleCheck className="h-5 w-5 text-primary" />
                      <span>Identify</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    Discover GPU assets and AI workloads at risk
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="protect">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Protect</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    Deploy AI Systems detection and response agents
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="detect">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-primary" />
                      <span>Detect</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    Monitor GPU activity, firmware, drivers, memory, and Detection & Response AI models including NLP, LLM, Deep Learning, Neural Networks, AI Vision
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="respond">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span>Respond</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    Trigger automated agents or manual playbooks for real-time security
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="recover">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-primary" />
                      <span>Recover</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    Isolate threats and maintain operational continuity
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Take Control of AI Security</h2>
            <p className="text-lg mb-12">
              ParaGuard sets a new standard for AI model and GPU infrastructure protection. Don't let blind spots in traditional security put your AI workloads at risk.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enhance GPU Security</h3>
                <p className="text-gray-300">with real-time AI & GPU threat detection</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Prevent Model Tampering</h3>
                <p className="text-gray-300">& Inference Attacks</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Stop GPU-Based Exploits</h3>
                <p className="text-gray-300">Before They Impact AI Integrity</p>
              </div>
            </div>
            
            <p className="text-xl mb-8">Ready to secure your AI infrastructure? Contact us today for a demo!</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ParaGuard;
