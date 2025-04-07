
import React from 'react';
import { Badge } from '@/components/ui/badge';

const Overview = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
          Cyber Supply Chain Security
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">DDX</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Cyber Supply Chain Forensic Inspection for Embedded Threats and Exploits
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="mb-4">
          <span className="font-semibold">DDX</span> is a cutting-edge <span className="font-semibold">cyber supply chain security platform</span> that provides comprehensive <span className="font-semibold">forensic inspection of software dependencies</span> to identify embedded threats and exploits.
        </p>
        <p className="mb-4">
          By utilizing <span className="font-semibold">advanced visualization techniques</span> and <span className="font-semibold">automated analysis</span>, DDX enables <span className="font-semibold">security teams to identify suspicious code patterns</span> and potential security risks in third-party dependencies and software components.
        </p>
        <p>
          Designed for <span className="font-semibold">organizations that need to validate their software supply chain</span>, DDX helps <span className="font-semibold">security teams detect malicious code, backdoors, and vulnerabilities</span> that could compromise system integrity before they become operational threats.
        </p>
      </div>
    </div>
  );
};

export default Overview;
