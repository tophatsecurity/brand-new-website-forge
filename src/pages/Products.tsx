
import React from 'react';
import Navbar from '@/components/Navbar';
import ProductsSection from '@/components/ProductsSection';
import ProductCategories from '@/components/ProductCategories';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Search, Radio, Server, Database, FileCheck, Eye } from "lucide-react";

const Products = () => {
  const productOverviews = [
    {
      title: "AI Security",
      description: "Our AI security products protect against emerging threats targeting artificial intelligence systems. With specialized tools for both edge computing and hyperscale environments, we ensure your AI assets remain secure and trustworthy.",
      icon: <Lock className="h-10 w-10 text-white" />,
      color: "bg-gradient-to-r from-blue-600 to-blue-800"
    },
    {
      title: "Cyber Supply Chain",
      description: "Secure your digital supply chain with our comprehensive solutions. From deep forensic inspection to detailed bill of materials analysis, we provide visibility into every component of your technology ecosystem.",
      icon: <Shield className="h-10 w-10 text-white" />,
      color: "bg-gradient-to-r from-purple-600 to-purple-800"
    },
    {
      title: "Asset Management",
      description: "Gain complete visibility of your operational technology and industrial control systems. Our asset management solutions provide real-time insights without requiring changes to your existing infrastructure.",
      icon: <Eye className="h-10 w-10 text-white" />,
      color: "bg-gradient-to-r from-emerald-600 to-emerald-800"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <div className="bg-gradient-to-r from-gray-100 to-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Security Solutions</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive cybersecurity platforms designed for AI Security, Cyber Supply Chain, and Asset Management solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Overview cards */}
        <div className="max-w-7xl mx-auto px-6 py-12 -mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productOverviews.map((item, index) => (
              <Card key={index} className="border-none shadow-xl">
                <CardHeader className={`${item.color} rounded-t-lg text-white`}>
                  <div className="flex items-center justify-center h-20">
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-white py-12">
          <ProductCategories />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Detailed Product Information</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our comprehensive suite of cybersecurity products designed to protect your most critical assets
            </p>
          </div>
          <ProductsSection />
        </div>
        
        <div className="text-center py-16 bg-[#f3f3f3] mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Need a Customized Security Solution?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Our experts can help you identify the right security tools for your specific needs.
          </p>
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-2 text-lg">
              Contact Our Team
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
