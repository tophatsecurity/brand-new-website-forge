
import React from 'react';
import { Shield, Lock, Database } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCategories = () => {
  const categories = [
    {
      title: "AI Security",
      icon: <Shield className="h-12 w-12 text-[#cc0c1a]" />,
      link: "/products#ai-security",
      description: "Advanced protection for AI systems"
    },
    {
      title: "Supply Chain Security",
      icon: <Lock className="h-12 w-12 text-[#cc0c1a]" />,
      link: "/products#supply-chain-security",
      description: "Secure your entire digital supply chain"
    },
    {
      title: "Industrial Asset Management",
      icon: <Database className="h-12 w-12 text-[#cc0c1a]" />,
      link: "/products#industrial-asset-management",
      description: "Complete visibility for OT/ICS environments"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/fb12631d-976c-47f1-8ee8-5f480d9ad104.png" 
          alt="TopHat Security Logo" 
          className="h-32 mx-auto mb-2"
        />
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {categories.map((category, index) => (
          <Link to={category.link} key={index}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
