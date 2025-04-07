
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield, Lock, Eye } from "lucide-react";

const AboutSection = () => {
  const keyPoints = [
    "Advanced technical capabilities for underserved areas",
    "Extensive background in preventing and fixing security problems",
    "Understanding of foreign actors, hidden threats, and the Dark Web",
    "Protection against hidden threats in the Supply Chain"
  ];

  return (
    <section id="about" className="section-padding bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-70 blur-lg"></div>
              <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                  alt="Our team collaborating" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="animate-slide-up opacity-0" style={{ animationDelay: '100ms' }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">TOPHAT SECURITY'S PHILOSOPHY</h2>
              <div className="w-20 h-1 bg-accent mb-6"></div>
              <h3 className="text-lg font-semibold text-accent mb-4">Advanced technology protection</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Tophat was founded six years ago with the desire to develop tools that provide advanced 
                technical capabilities for areas that have been largely under served.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our extensive background in preventing and fixing security problems has been the cornerstone 
                for developing security products based on an understanding of foreign actors, hidden threats, 
                and the presence of the Dark Web.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Tophat Security addresses hidden threats from devices in the Supply Chain. We also offer 
                advanced monitoring based on understanding attack vectors and breaches.
              </p>
              
              <div className="space-y-4 mb-8">
                {keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-accent mr-3 flex-shrink-0" />
                    <p className="text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
