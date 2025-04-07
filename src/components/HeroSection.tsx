
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, AlertCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-6 md:px-12 lg:px-24 hero-gradient circuit-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Advanced <span className="text-[#cc0c1a]">cybersecurity</span> for the modern business
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Protecting your digital assets with enterprise-grade security solutions tailored to your organization's unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-6 text-lg">
                Get a free assessment
              </Button>
              <Button variant="outline" className="group px-8 py-6 text-lg border-[#222] text-[#222] hover:bg-[#222] hover:text-white">
                Our solutions 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#cc0c1a] to-[#222] rounded-lg opacity-30 blur"></div>
              <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
                <div className="p-1 bg-gradient-to-r from-[#cc0c1a] to-[#222]">
                  <div className="bg-white p-8 flex flex-col items-center space-y-6">
                    <img 
                      src="/public/lovable-uploads/3d8e6f15-58c0-462a-854f-0f4cacfa0fb5.png" 
                      alt="TopHat Security Logo" 
                      className="h-32 md:h-40"
                    />
                    <div className="grid grid-cols-3 gap-4 w-full">
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <Shield className="h-8 w-8 text-[#cc0c1a] mb-2" />
                        <span className="text-center text-sm font-medium">Threat Protection</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <Lock className="h-8 w-8 text-[#cc0c1a] mb-2" />
                        <span className="text-center text-sm font-medium">Data Encryption</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <AlertCircle className="h-8 w-8 text-[#cc0c1a] mb-2" />
                        <span className="text-center text-sm font-medium">Incident Response</span>
                      </div>
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
