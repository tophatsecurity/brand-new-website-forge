
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Search, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProductsSection = () => {
  const products = [
    {
      title: "SeekCAP",
      description: "Industrial network visibility and packet analysis without SPAN ports.",
      icon: <Search className="h-8 w-8 text-primary" />,
      borderColor: "border-primary",
      link: "/seekcap"
    },
    {
      title: "DDX",
      description: "Cyber supply chain forensic inspection for embedded threats and exploits.",
      icon: <Shield className="h-8 w-8 text-primary" />,
      borderColor: "border-primary",
      link: "/ddx"
    },
    {
      title: "Paraguard",
      description: "AI security detection & response for AI Edge and Hyperscale environments.",
      icon: <Lock className="h-8 w-8 text-primary" />,
      borderColor: "border-primary",
      link: "#"
    },
    {
      title: "The Listening Post",
      description: "Real-time passive monitoring of communications and RF traffic.",
      icon: <Radio className="h-8 w-8 text-primary" />,
      borderColor: "border-primary",
      link: "/secondlook"
    }
  ];

  return (
    <section id="products" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Products</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge cybersecurity solutions designed to protect your business from evolving digital threats.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <Card key={index} className={`service-card transition-all duration-300 animate-slide-up opacity-0 border-t-0 border-l-4 ${product.borderColor} bg-background text-foreground`} style={{ animationDelay: `${index * 100 + 200}ms` }}>
              <CardHeader className="pb-2">
                <div className="mb-4">{product.icon}</div>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <Link to={product.link}>
                  <Button 
                    variant={product.link !== "#" ? "default" : "outline"} 
                    className={product.link !== "#" ? "bg-[#cc0c1a] hover:bg-[#a80916] text-white" : ""}
                  >
                    {product.link !== "#" ? "Learn More" : "Coming Soon"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 animate-slide-up opacity-0" style={{ animationDelay: "600ms" }}>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Each platform is modular, field-tested, and tailored to OT, defense, and AI environments.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
