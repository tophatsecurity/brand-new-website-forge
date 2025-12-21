
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Search, Radio, Server, Database, FileCheck, Eye, Footprints, Copy, CircuitBoard } from "lucide-react";
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
          title: "PARAGUARD",
          description: "AI security detection & response for AI Edge and Hyperscale environments.",
          longDescription: "PARAGUARD offers advanced AI-powered security detection and automated response systems specifically designed for AI Edge computing and Hyperscale environments, protecting against emerging threats.",
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
          title: "SecondLook XBOM",
          description: "Comprehensive Bill of Materials Intelligence for software, hardware, and firmware components.",
          longDescription: "SecondLook XBOM platform provides detailed analysis and risk assessment for Software, Hardware, and Firmware Bills of Materials, ensuring complete transparency in your supply chain components.",
          icon: <FileCheck className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/secondlook"
        },
        {
          title: "ONBOARD",
          description: "Supply chain board forensics and complete chain enumeration.",
          longDescription: "ONBOARD provides deep hardware forensics for circuit boards, enumerating complete supply chains and detecting counterfeit components, hardware trojans, and unauthorized modifications.",
          icon: <CircuitBoard className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/onboard"
        }
      ]
    },
    {
      category: "OT/ICS Security",
      id: "ot-ics-security",
      products: [
        {
          title: "LIGHTFOOT",
          description: "A lightfooted probe for OT/ICS using native industrial protocols.",
          longDescription: "LIGHTFOOT provides non-intrusive OT/ICS network discovery and monitoring using native industrial protocols, enabling complete visibility without disrupting critical processes.",
          icon: <Footprints className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/lightfoot"
        },
        {
          title: "O-RANGE",
          description: "Digital twin for OT Networks — red teaming without the risk.",
          longDescription: "O-RANGE creates digital twins of factories, plants, assembly lines, railroads, and any automation-dependent system for safe red team operations and security testing.",
          icon: <Copy className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/orange"
        },
        {
          title: "SeekCAP",
          description: "Industrial network visibility and packet analysis without SPAN ports.",
          longDescription: "SeekCAP provides comprehensive industrial network visibility and detailed packet analysis without requiring SPAN ports. It enables security teams to monitor OT networks with minimal infrastructure changes.",
          icon: <Eye className="h-8 w-8 text-primary" />,
          borderColor: "border-primary",
          link: "/seekcap"
        }
      ]
    }
  ];

  const allProducts = productCategories.flatMap(category => category.products);

  return (
    <section id="products" className="section-padding">
      <div className="max-w-7xl mx-auto">
        {productCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16" id={category.id}>
            <h3 className="text-2xl font-semibold mb-6 border-l-4 border-primary pl-4">
              {category.category}
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {category.products.map((product, productIndex) => (
                <Card 
                  key={productIndex} 
                  className={`service-card transition-all duration-300 animate-slide-up opacity-0 border-t-0 border-l-4 ${product.borderColor} bg-background text-foreground hover:shadow-lg`} 
                  style={{ animationDelay: `${productIndex * 100 + 200}ms` }}
                >
                  <Link to={product.link} className="block h-full">
                    <CardHeader className="pb-2">
                      <div className="mb-4">{product.icon}</div>
                      <CardTitle className="hover:text-primary transition-colors">{product.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{product.description}</p>
                      <Button 
                        variant="default"
                        className="bg-[#cc0c1a] hover:bg-[#a80916] text-white"
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        <div className="block md:mt-16">
          <h3 className="text-2xl font-semibold mb-6 text-center">Featured Solutions</h3>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {allProducts.map((product, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-1">
                    <Card className={`h-full border-t-0 border-l-4 ${product.borderColor} bg-background text-foreground hover:shadow-lg`}>
                      <Link to={product.link} className="block h-full">
                        <CardHeader className="pb-2">
                          <div className="mb-4">{product.icon}</div>
                          <CardTitle className="hover:text-primary transition-colors">{product.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col h-full">
                          <p className="text-muted-foreground mb-6 flex-grow">{product.longDescription}</p>
                          <Button 
                            variant="default"
                            className="bg-[#cc0c1a] hover:bg-[#a80916] text-white w-full mt-auto"
                          >
                            Learn More
                          </Button>
                        </CardContent>
                      </Link>
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
      </div>
    </section>
  );
};

export default ProductsSection;
