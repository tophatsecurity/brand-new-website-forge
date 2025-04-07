
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Search, Eye } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "DDX",
      description: "Advanced data detection and exfiltration prevention system that protects your organization's sensitive information.",
      icon: <Shield className="h-8 w-8 text-primary" />
    },
    {
      title: "PARAGUARD",
      description: "Complete network protection solution that identifies and neutralizes threats before they can compromise your systems.",
      icon: <Lock className="h-8 w-8 text-primary" />
    },
    {
      title: "SEEKCAP",
      description: "Intelligent threat hunting and vulnerability assessment platform that proactively discovers security weaknesses.",
      icon: <Search className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Products</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge cybersecurity solutions designed to protect your business from evolving digital threats.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="service-card border-t-4 border-t-primary transition-all duration-300 animate-slide-up opacity-0" style={{ animationDelay: `${index * 100 + 200}ms` }}>
              <CardHeader className="pb-2">
                <div className="mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
