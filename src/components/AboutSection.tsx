
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const AboutSection = () => {
  const keyPoints = [
    "10+ years of industry experience",
    "Award-winning team of experts",
    "Tailored solutions for your business",
    "Ongoing support and maintenance"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About Our Company</h2>
              <div className="w-20 h-1 bg-accent mb-6"></div>
              <p className="text-lg text-muted-foreground mb-8">
                AcmeCorp was founded in 2010 with a mission to deliver exceptional digital solutions that help businesses thrive in the modern marketplace. We combine innovative technology with strategic thinking to create impactful results.
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
