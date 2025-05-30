
import React from 'react';
import { Shield, Lock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProductCategories = () => {
  const categories = [
    {
      title: "AI Security",
      icon: <Shield className="h-12 w-12 text-white" />,
      description: "Advanced protection for AI systems",
      href: "#ai-security"
    },
    {
      title: "Cyber Supply Chain",
      icon: <Lock className="h-12 w-12 text-white" />,
      description: "Secure your entire digital supply chain",
      href: "#cyber-supply-chain"
    },
    {
      title: "Asset Management",
      icon: <Eye className="h-12 w-12 text-white" />,
      description: "Complete visibility for OT/ICS environments",
      href: "#visibility"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Security Solutions</h2>
        <div className="w-24 h-1 bg-[#cc0c1a] mx-auto mb-6"></div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive cybersecurity platforms for today's evolving threat landscape
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <a 
            key={index} 
            href={category.href}
            className="block group"
          >
            <Card className="h-full bg-gradient-to-b from-white to-gray-50 hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#cc0c1a] overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-6 bg-[#cc0c1a] rounded-full p-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
