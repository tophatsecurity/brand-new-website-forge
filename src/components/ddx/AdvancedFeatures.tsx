
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Brain, Users, Shield, Lock, FileSearch, Network, Activity } from 'lucide-react';

const AdvancedFeatures = () => {
  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Advanced Testing & Security Features</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="border-l-4 border-l-[#cc0c1a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="h-6 w-6 text-[#cc0c1a]" />
              Testing Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The DDX platform incorporates multiple proprietary techniques for testing devices and components related to supply chain vulnerabilities. It combines data sets from various vectors to create a holistic risk management strategy.
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                <span>Devices are quarantined on-site during testing.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                <span>Local appliance for testing (virtual or physical).</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                <span>User profiles for test setup and scheduling.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                <span>Real-time testing status and alerts for detected security threats.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#cc0c1a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-[#cc0c1a]" />
              Reports and Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                <span><strong>Summary Reports:</strong> High-level overview for management review and strategic decisions.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                <span><strong>Detailed Reports:</strong> Granular data for administrators to understand specific threats and vulnerabilities.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                <span><strong>Alerts:</strong> Real-time notifications for critical security risks.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-[#cc0c1a] flex-shrink-0" />
                <span><strong>Dashboard:</strong> Aggregated data and risk assessments displayed visually for quick situational awareness (includes geo-location, vendor, and supply chain risks).</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-xl font-bold mb-6">Security Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-6 w-6 text-[#cc0c1a]" />
            <h4 className="font-semibold">AI-Machine Learning</h4>
          </div>
          <p className="text-muted-foreground">Utilized to enhance the detection and prediction of security threats in devices.</p>
        </div>
        
        <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-6 w-6 text-[#cc0c1a]" />
            <h4 className="font-semibold">Vendor Risk Management</h4>
          </div>
          <p className="text-muted-foreground">Assessments of vendor and supply chain risk through data analytics.</p>
        </div>
        
        <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-6 w-6 text-[#cc0c1a]" />
            <h4 className="font-semibold">Firmware & Binary Analysis</h4>
          </div>
          <p className="text-muted-foreground">Detailed analysis of firmware components to detect potential vulnerabilities and exploits.</p>
        </div>
        
        <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-6 w-6 text-[#cc0c1a]" />
            <h4 className="font-semibold">Instrumented Quarantine</h4>
          </div>
          <p className="text-muted-foreground">Devices placed in a secure quarantine while testing is in progress.</p>
        </div>
        
        <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Network className="h-6 w-6 text-[#cc0c1a]" />
            <h4 className="font-semibold">Network Capture and Forensics</h4>
          </div>
          <p className="text-muted-foreground">Capture of network traffic during device testing to identify potential breaches.</p>
        </div>
        
        <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <FileSearch className="h-6 w-6 text-[#cc0c1a]" />
            <h4 className="font-semibold">System Integrations</h4>
          </div>
          <p className="text-muted-foreground">Capability for integrating with existing security systems.</p>
        </div>
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">Global Threat Analysis Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
            <h4 className="font-semibold mb-3">Geo-location-based Threats</h4>
            <p className="text-muted-foreground">Uses cloud-based intelligence to analyze the risk posed by the origin of supply chain components.</p>
          </div>
          
          <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
            <h4 className="font-semibold mb-3">Vendor Data Risk Trends</h4>
            <p className="text-muted-foreground">Tracks global trends and threats from suppliers, highlighting potential vulnerabilities based on geographic location.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeatures;
