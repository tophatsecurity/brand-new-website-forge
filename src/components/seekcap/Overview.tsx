
import React from 'react';
import { Badge } from '@/components/ui/badge';

const Overview = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
          Advanced OT Visibility Solution
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">SEEKCAP</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Advanced OT Visibility & Packet Analysis Solution
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="mb-4">
          <span className="font-semibold">SEEKCAP</span> is a cutting-edge <span className="font-semibold">network visibility and packet analysis solution</span> designed to provide deep insight into remote networks <span className="font-semibold">without requiring a SPAN port</span> on physical switches.
        </p>
        <p className="mb-4">
          By utilizing <span className="font-semibold">native switch telemetry tools</span> and the ability to collect <span className="font-semibold">PCAPs from Ethernet interfaces on other systems</span>, SEEKCAP enables <span className="font-semibold">real-time traffic monitoring and protocol analysis</span> while ensuring minimal network impact.
        </p>
        <p>
          Originally developed for a <span className="font-semibold">military organization</span>, SEEKCAP is currently <span className="font-semibold">in active production use within military networks</span>, delivering <span className="font-semibold">mission-critical network visibility and security monitoring</span>. Tophat Security retains all rights to its source code and continues development to expand its capabilities.
        </p>
      </div>
    </div>
  );
};

export default Overview;
