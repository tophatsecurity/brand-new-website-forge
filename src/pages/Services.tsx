
import React from 'react';
import Navbar from '@/components/Navbar';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Layers, Clock, Search, Cpu, Wifi, FileCheck } from "lucide-react";

const Services = () => {
  const serviceCategories = [
    {
      title: "Cyber Defense Services",
      description: "Our cyber defense services help organizations identify, prevent, and respond to security threats across their digital landscape.",
      services: ["SecondLook", "Device Assessment", "Technical Cyber Supply Chain Analysis"]
    },
    {
      title: "Compliance & Regulatory Services",
      description: "Stay compliant with industry standards and government regulations with our specialized compliance services.",
      services: ["CMMC Regulation Management", "NERC-CIP Compliance", "Security Assessment Documentation"]
    },
    {
      title: "Technical Security Services",
      description: "Leverage our technical expertise to evaluate and enhance your security posture through specialized technical services.",
      services: ["Firmware Extractions", "IV&V of Device Components", "Long Term Quarantine Analysis"]
    }
  ];

  const serviceHighlights = [
    {
      icon: <Shield className="h-10 w-10 text-[#cc0c1a]" />,
      title: "24/7 Security Monitoring",
      description: "Continuous monitoring of your critical systems and networks to detect and respond to threats in real-time."
    },
    {
      icon: <FileText className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Detailed Security Reports",
      description: "Comprehensive reporting that provides actionable insights to improve your security posture."
    },
    {
      icon: <Layers className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Multi-Layer Security",
      description: "A layered approach to security that addresses threats at every level of your technology stack."
    },
    {
      icon: <Cpu className="h-10 w-10 text-[#cc0c1a]" />,
      title: "Hardware & Firmware Security",
      description: "Specialized expertise in securing hardware components and firmware against sophisticated attacks."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32">
        <div className="bg-[#1A1F2C] pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-6">Our Security Services</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Professional cybersecurity services tailored to protect your organization from emerging threats.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} className="border-none shadow-xl bg-white">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {highlight.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Service Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {serviceCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                    <p className="text-muted-foreground mb-6">{category.description}</p>
                    <ul className="space-y-2">
                      {category.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-[#cc0c1a] mr-2"></div>
                          <span className="text-[#ea384c] hover:underline">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Detailed Service Offerings</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our comprehensive range of professional security services designed to meet your organization's unique requirements
            </p>
          </div>
          <ServicesSection />
        </div>
        
        <div className="text-center py-16 bg-[#f3f3f3] mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Need a Customized Security Solution?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Our experts can help you identify the right security services for your specific needs.
          </p>
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-2">
              Contact Our Team
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
