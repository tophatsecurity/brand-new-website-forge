
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PerpetualFeatures = () => {
  const features = [
    {
      title: "Threat Intelligence Integration",
      description: "Leverage the latest threat intelligence to identify and prioritize security risks based on your specific environment."
    },
    {
      title: "Vulnerability Scanning",
      description: "Regular automated and manual scanning to identify vulnerabilities across your applications, networks, and infrastructure."
    },
    {
      title: "Penetration Testing",
      description: "Scheduled penetration tests to simulate real-world attacks and identify potential security gaps in your systems."
    },
    {
      title: "Security Compliance",
      description: "Ensure ongoing compliance with industry regulations and standards such as GDPR, HIPAA, PCI DSS, and NIST frameworks."
    },
    {
      title: "Security Training",
      description: "Regular security awareness training for your team to build a strong human firewall against social engineering attacks."
    },
    {
      title: "Incident Response Planning",
      description: "Development and testing of incident response plans to ensure rapid and effective action in case of security incidents."
    }
  ];

  return (
    <section className="mb-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Key Features</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Our comprehensive security evaluation service includes these key components to ensure complete protection.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-t-4 border-t-[#cc0c1a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PerpetualFeatures;
