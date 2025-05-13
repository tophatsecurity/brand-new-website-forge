
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ParaGuardHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const productSlides = [
    {
      image: "/lovable-uploads/627629f2-285b-4e9e-91c2-8baf0461d459.png",
      title: "ParaGuard Dashboard",
      description: "Resource monitoring with security risk assessment"
    },
    {
      image: "/lovable-uploads/a511ebb5-eb08-41fb-8517-00b96e1b0576.png",
      title: "SEEKCAP Platform",
      description: "Advanced OT visibility with network statistics"
    },
    {
      image: "/lovable-uploads/1ebf712a-3070-4abd-b738-09ed2c4a6d09.png",
      title: "DDX TrustTrees",
      description: "Supply chain dependency mapping visualization"
    },
    {
      image: "/lovable-uploads/051a0085-f9a9-4723-ac0b-3c746a4cedd8.png",
      title: "DDX Dashboard",
      description: "Risk metrics with threat actor geo-location"
    },
    {
      image: "/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png",
      title: "SecondLook X",
      description: "Passive monitoring with automated alerts"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % productSlides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [productSlides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? productSlides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % productSlides.length
    );
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2">
            <Badge variant="outline" className="bg-primary/10 text-primary mb-4">AI Security</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">ParaGuard AI Security Platform</h1>
            <p className="text-xl text-gray-300 mb-8">
              Comprehensive AI security platform from AI Hardware to Model security.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                  Request a Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full relative">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                {/* Image carousel */}
                <div className="relative aspect-video bg-black/30 rounded-lg">
                  {productSlides.map((slide, index) => (
                    <div 
                      key={index}
                      className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-contain"
                      />
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-lg font-semibold text-white">{slide.title}</h3>
                        <p className="text-sm text-gray-200">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Navigation buttons */}
                  <button 
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <button 
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                {/* Dots indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                  {productSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? "bg-primary" : "bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParaGuardHero;
