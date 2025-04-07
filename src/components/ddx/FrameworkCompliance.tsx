
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';

const FrameworkCompliance = () => {
  const benefits = [
    {
      title: "Compliance Assurance",
      description: "Ensures that organizations meet regulatory and industry-specific cybersecurity requirements."
    },
    {
      title: "Supply Chain Risk Mitigation",
      description: "Enables comprehensive assessment and mitigation of risks associated with suppliers and vendors."
    },
    {
      title: "Proactive Threat Identification",
      description: "Aligns with industry best practices to proactively identify and address vulnerabilities within the supply chain before they can be exploited."
    },
    {
      title: "Real-time Risk Awareness",
      description: "Integrates global threat intelligence and situational awareness to keep businesses informed of emerging risks."
    }
  ];

  return (
    <div className="my-16 bg-[#f8f8f8] p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Key Benefits of Framework Alignment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="bg-white border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-[#cc0c1a] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FrameworkCompliance;
