
import React from 'react';
import { Badge } from '@/components/ui/badge';

const Overview = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
          Cyber Supply Chain Security
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">DDX - Due Diligence Expedited</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Cyber Supply Chain Forensic Inspection for Embedded Threats and Exploits
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="mb-4">
          <span className="font-semibold">DDX</span> is a cutting-edge <span className="font-semibold">software-based platform designed for cyber supply chain risk management</span>, providing assurance against embedded threats in connected devices before deployment.
        </p>
        <p className="mb-4">
          By utilizing <span className="font-semibold">advanced visualization techniques</span> and <span className="font-semibold">automated analysis</span>, DDX enables <span className="font-semibold">security teams to identify suspicious code patterns</span> and potential security risks in third-party dependencies and software components.
        </p>
        <p>
          Designed to address risks from embedded threats in OEM parts, materials, software, and components that have seen a sharp rise in the last two years, DDX helps <span className="font-semibold">organizations validate their software supply chain</span> and <span className="font-semibold">detect malicious code, backdoors, and vulnerabilities</span> before they become operational threats.
        </p>
      </div>
    </div>
  );
};

export default Overview;
