
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, HelpCircle, Shield, Hammer } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "Security Consulting",
      description: "Expert security assessments and strategic roadmaps tailored to your organization's needs.",
      icon: <HelpCircle className="h-8 w-8 text-primary" />,
      borderColor: "border-cyan-400"
    },
    {
      title: "Penetration Testing",
      description: "Comprehensive testing to identify vulnerabilities before malicious actors can exploit them.",
      icon: <Hammer className="h-8 w-8 text-primary" />,
      borderColor: "border-cyan-400"
    },
    {
      title: "Security Compliance",
      description: "Navigate complex regulatory landscapes with our compliance expertise and guidance.",
      icon: <FileText className="h-8 w-8 text-primary" />,
      borderColor: "border-cyan-400"
    },
    {
      title: "Incident Response",
      description: "Rapid response and recovery services when security incidents occur.",
      icon: <Shield className="h-8 w-8 text-primary" />,
      borderColor: "border-cyan-400"
    }
  ];

  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Services</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional cybersecurity services to help secure your organization at every level.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className={`service-card transition-all duration-300 animate-slide-up opacity-0 border-t-0 border-l-4 ${service.borderColor} bg-gray-900 text-white`} style={{ animationDelay: `${index * 100 + 200}ms` }}>
              <CardHeader className="pb-2">
                <div className="mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 animate-slide-up opacity-0" style={{ animationDelay: "600ms" }}>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our team of experienced security professionals is ready to help protect your valuable digital assets.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
