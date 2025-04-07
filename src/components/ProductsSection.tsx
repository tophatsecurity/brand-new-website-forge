
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Search, Radio, Server, Database, FileCheck, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductsSection = () => {
  const productCategories = [
    {
      category: "AI Security",
      id: "ai-security",
      products: [
        {
          title: "ParaGuard",
          description: "AI security detection & response for AI Edge and Hyperscale environments.",
          longDescription: "ParaGuard offers advanced AI-powered security detection and automated response systems specifically designed for AI Edge computing and Hyperscale environments, protecting against emerging threats.",
          icon: <Lock className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/paraguard"
        }
      ]
    },
    {
      category: "Cyber Supply Chain",
      id: "cyber-supply-chain",
      products: [
        {
          title: "DDX",
          description: "Cyber supply chain forensic inspection for embedded threats and exploits.",
          longDescription: "The DDX platform delivers in-depth cyber supply chain forensic inspection capabilities, detecting embedded threats and exploits in hardware, firmware, and software components before deployment.",
          icon: <Shield className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/ddx"
        },
        {
          title: "SecondLook SBOM",
          description: "Comprehensive Bill of Materials Intelligence for software, hardware, and firmware components.",
          longDescription: "SecondLook SBOM platform provides detailed analysis and risk assessment for Software, Hardware, and Firmware Bills of Materials, ensuring complete transparency in your supply chain components.",
          icon: <FileCheck className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/secondlook"
        }
      ]
    },
    {
      category: "Asset Management",
      id: "visibility",
      products: [
        {
          title: "SeekCAP",
          description: "Industrial network visibility and packet analysis without SPAN ports.",
          longDescription: "SeekCAP provides comprehensive industrial network visibility and detailed packet analysis without requiring SPAN ports. It enables security teams to monitor OT networks with minimal infrastructure changes.",
          icon: <Eye className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/seekcap"
        }
      ]
    },
    {
      category: "Security Services",
      id: "security-services",
      products: [
        {
          title: "Security Perpetual Evaluation",
          description: "Continuous security assessment and monitoring for evolving threat landscapes.",
          longDescription: "Our Security Perpetual Evaluation service provides ongoing assessment and monitoring to protect your organization against evolving cyber threats and vulnerabilities.",
          icon: <Search className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/security-perpetual"
        }
      ]
    }
  ];

  // Flatten products array for the carousel
  const allProducts = productCategories.flatMap(category => category.products);

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
        
        {/* Display products by category */}
        {productCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16" id={category.id}>
            <h3 className="text-2xl font-semibold mb-6 border-l-4 border-primary pl-4">
              {category.category}
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {category.products.map((product, productIndex) => (
                <Card 
                  key={productIndex} 
                  className={`service-card transition-all duration-300 animate-slide-up opacity-0 border-t-0 border-l-4 ${product.borderColor} bg-background text-foreground`} 
                  style={{ animationDelay: `${productIndex * 100 + 200}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="mb-4">{product.icon}</div>
                    <CardTitle>{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <Link to={product.link}>
                      <Button 
                        variant="default"
                        className="bg-[#cc0c1a] hover:bg-[#a80916] text-white"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {/* Product carousel for featured solutions */}
        <div className="block md:mt-16">
          <h3 className="text-2xl font-semibold mb-6 text-center">Featured Solutions</h3>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {allProducts.map((product, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-1">
                    <Card className={`h-full border-t-0 border-l-4 ${product.borderColor} bg-background text-foreground`}>
                      <CardHeader className="pb-2">
                        <div className="mb-4">{product.icon}</div>
                        <CardTitle>{product.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col h-full">
                        <p className="text-muted-foreground mb-6 flex-grow">{product.longDescription}</p>
                        <Link to={product.link} className="mt-auto">
                          <Button 
                            variant="default"
                            className="bg-[#cc0c1a] hover:bg-[#a80916] text-white w-full"
                          >
                            Learn More
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-4">
              <CarouselPrevious className="static transform-none mx-2" />
              <CarouselNext className="static transform-none mx-2" />
            </div>
          </Carousel>
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
