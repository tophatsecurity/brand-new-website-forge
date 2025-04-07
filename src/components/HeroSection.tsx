
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Database } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCategories from '@/components/ProductCategories';

const HeroSection = () => {
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
                    <ProductCategories />
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
