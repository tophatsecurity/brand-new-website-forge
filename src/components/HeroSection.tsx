
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  const productScreenshots = [
    {
      image: "/lovable-uploads/05c32b3b-c00b-4af9-acd5-cac7a7986e4a.png",
      name: "Product Categories",
      note: "Complete security solutions across AI, Supply Chain, and Industrial management"
    },
    {
      image: "/public/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png",
      name: "SecondLook X",
      note: "Passive monitoring with automated alerts for enhanced cybersecurity"
    },
    {
      image: "/lovable-uploads/fb12631d-976c-47f1-8ee8-5f480d9ad104.png",
      name: "TopHat Security",
      note: "Comprehensive protection for your entire technology ecosystem"
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
          <div className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#cc0c1a] to-[#222] rounded-lg opacity-30 blur"></div>
              <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
                <div className="p-1 bg-gradient-to-r from-[#cc0c1a] to-[#222]">
                  <div className="bg-white p-8">
                    <h3 className="text-2xl font-semibold text-center mb-6">Product Showcase</h3>
                    <div className="grid gap-6">
                      {productScreenshots.map((screenshot, index) => (
                        <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img 
                              src={screenshot.image} 
                              alt={screenshot.name}
                              className="w-full object-cover rounded-t-lg"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                              <h4 className="font-semibold">{screenshot.name}</h4>
                            </div>
                          </div>
                          <CardContent className="p-4 bg-gray-50">
                            <p className="text-sm text-gray-600">{screenshot.note}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
