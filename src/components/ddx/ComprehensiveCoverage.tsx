
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, Building2, ShieldCheck } from 'lucide-react';

const ComprehensiveCoverage = () => {
  return (
    <div className="my-16 bg-card p-8 rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-8 text-center">Comprehensive Security Coverage</h2>
      
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Server className="h-4 w-4" /> Supported Equipment
          </TabsTrigger>
          <TabsTrigger value="industries" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Industries Served
          </TabsTrigger>
          <TabsTrigger value="regulations" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Regulations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment" className="mt-6 p-4">
          <h3 className="text-xl font-semibold mb-4">The DDX platform provides multi-functional testing for:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc pl-6">
            <li>OT, ICS, SCADA, IoT, Weapon Systems, OEM equipment</li>
            <li>Firmware, Software</li>
            <li>Wireless, Radio Frequency</li>
            <li>Hardware Analysis</li>
            <li>Threat and vulnerability correlation across 50,000+ suppliers and 4th party of sub-suppliers</li>
          </ul>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Deployment and Installation Options</h3>
            <p className="mb-2">Can be installed on:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc pl-6">
              <li>Servers, laptops, or virtual appliances (VMware/Hyper-V)</li>
              <li>Cloud platforms (AWS/Azure)</li>
              <li>Dedicated hardened appliances</li>
              <li>Completely isolated, non-networked environments or remote areas with cellular connectivity</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="industries" className="mt-6 p-4">
          <h3 className="text-xl font-semibold mb-4">Industries Served</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc pl-6">
            <li>Department of Defense Contractors</li>
            <li>US Government Agencies</li>
            <li>Financial Services</li>
            <li>Medical Device Manufacturers</li>
            <li>Oil and Gas Pipelines</li>
            <li>Utility and Power Distribution</li>
            <li>Healthcare Institutions</li>
            <li>Multinational Corporations</li>
            <li>Renewable Energy Companies</li>
            <li>Municipal Governments</li>
          </ul>
        </TabsContent>
        
        <TabsContent value="regulations" className="mt-6 p-4">
          <h3 className="text-xl font-semibold mb-4">Supported Regulations and Frameworks</h3>
          <ul className="space-y-3 pl-6 list-disc">
            <li><strong>NIST-800-53-R5:</strong> Many control areas</li>
            <li><strong>CMMC 2.0:</strong> Supply Chain Analysis, Threats, and Risks</li>
            <li><strong>ISO/IEC 27001:</strong> International standard for managing information security, ensuring confidentiality, integrity, and availability of information</li>
            <li><strong>GDPR:</strong> While primarily a data privacy regulation, GDPR impacts how companies handle security risks, including those arising from third-party vendors and suppliers</li>
            <li><strong>NERC:</strong> Focuses on ensuring the security and integrity of the electric grid and other critical infrastructure</li>
            <li><strong>FISMA:</strong> Establishes a framework for securing government information systems and mandates strict control over third-party vendors and supply chains</li>
            <li><strong>HIPAA:</strong> Addresses securing personal health information, including risks in the medical supply chain</li>
            <li><strong>DFARS:</strong> Requires defense contractors to ensure that their suppliers meet stringent cybersecurity requirements</li>
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveCoverage;
