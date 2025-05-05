
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Database, Images } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  const productScreenshots = [
    {
      image: "/lovable-uploads/a511ebb5-eb08-41fb-8517-00b96e1b0576.png",
      name: "SEEKCAP Dashboard",
      description: "Main dashboard with asset tracking and network statistics"
    },
    {
      image: "/lovable-uploads/1ebf712a-3070-4abd-b738-09ed2c4a6d09.png",
      name: "DDX TrustTrees",
      description: "Advanced visualization for supply chain dependency mapping"
    },
    {
      image: "/lovable-uploads/051a0085-f9a9-4723-ac0b-3c746a4cedd8.png",
      name: "DDX Dashboard",
      description: "Organization overview with risk metrics and threat actor geo-location"
    },
    {
      image: "/lovable-uploads/627629f2-285b-4e9e-91c2-8baf0461d459.png",
      name: "ParaGuard Security Platform",
      description: "Resource monitoring with security risk assessment dashboard"
    },
    {
      image: "/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png",
      name: "SecondLook X",
      description: "Passive monitoring with automated alerts"
    }
  ];

  return (
    <section className="pt-32 pb-20 px-6 md:px-12 lg:px-24 hero-gradient circuit-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-[#cc0c1a]">AI Security</span> & Cyber Supply Chain Protection
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Safeguarding your AI systems and securing your entire digital supply chain with specialized solutions for today's complex threat landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-6 text-lg">
                Get a free assessment
              </Button>
              <Link to="/products">
                <Button variant="outline" className="group px-8 py-6 text-lg border-[#222] text-[#222] hover:bg-[#222] hover:text-white">
                  Our solutions 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-10 lg:mt-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative">
              <div className="border-2 border-[#cc0c1a] rounded-lg p-6 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Images className="w-5 h-5 mr-2 text-[#cc0c1a]" />
                    Our Products
                  </h3>
                </div>
                
                <Carousel className="w-full">
                  <CarouselContent>
                    {productScreenshots.map((screenshot, index) => (
                      <CarouselItem key={index}>
                        <Card className="border-none shadow-sm">
                          <div className="relative aspect-video bg-black/5 rounded-t-lg overflow-hidden">
                            <img 
                              src={screenshot.image} 
                              alt={screenshot.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <CardContent className="p-4 bg-gray-50 rounded-b-lg">
                            <h4 className="font-medium text-sm mb-1">{screenshot.name}</h4>
                            <p className="text-xs text-gray-600">{screenshot.description}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center mt-4">
                    <CarouselPrevious className="relative inline-flex h-8 w-8 mx-2 transform-none" />
                    <CarouselNext className="relative inline-flex h-8 w-8 mx-2 transform-none" />
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
