
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
      name: "PARAGUARD Security Platform",
      description: "Resource monitoring with security risk assessment dashboard"
    },
    {
      image: "/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png",
      name: "SECONDLOOK X",
      description: "Passive monitoring with automated alerts"
    }
  ];

  return (
    <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 lg:px-24 hero-gradient circuit-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 animate-fade-in text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 md:mb-6">
              <span className="text-[#cc0c1a]">AI Security</span> & Cyber Supply Chain Protection
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0">
              Safeguarding your AI systems and securing your entire digital supply chain with specialized solutions for today's complex threat landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Link to="/contact">
                <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full sm:w-auto">
                  Get a free assessment
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="group px-6 md:px-8 py-4 md:py-6 text-base md:text-lg border-[#222] text-[#222] hover:bg-[#222] hover:text-white w-full sm:w-auto">
                  Our solutions 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative">
              <div className="border-2 border-[#cc0c1a] rounded-lg p-3 md:p-6 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="text-lg md:text-xl font-semibold flex items-center">
                    <Images className="w-4 h-4 md:w-5 md:h-5 mr-2 text-[#cc0c1a]" />
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
                          <CardContent className="p-3 md:p-4 bg-gray-50 rounded-b-lg">
                            <h4 className="font-medium text-sm md:text-base mb-1 leading-tight">{screenshot.name}</h4>
                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">{screenshot.description}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center mt-3 md:mt-4">
                    <CarouselPrevious className="relative inline-flex h-6 w-6 md:h-8 md:w-8 mx-1 md:mx-2 transform-none" />
                    <CarouselNext className="relative inline-flex h-6 w-6 md:h-8 md:w-8 mx-1 md:mx-2 transform-none" />
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
