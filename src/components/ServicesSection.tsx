
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, LineChart, Layout, Smartphone } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "Web Development",
      description: "Custom websites and web applications tailored to your specific business needs.",
      icon: <Code className="h-8 w-8 text-primary" />
    },
    {
      title: "Mobile Applications",
      description: "Native and cross-platform mobile apps that provide seamless user experiences.",
      icon: <Smartphone className="h-8 w-8 text-primary" />
    },
    {
      title: "UI/UX Design",
      description: "Intuitive and engaging user interfaces that enhance customer satisfaction.",
      icon: <Layout className="h-8 w-8 text-primary" />
    },
    {
      title: "Data Analytics",
      description: "Comprehensive data analysis to help you make informed business decisions.",
      icon: <LineChart className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Services</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer a comprehensive range of services to help your business succeed in the digital landscape.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
