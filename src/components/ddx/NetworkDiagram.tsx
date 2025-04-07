
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NetworkDiagram = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenshots = [
    {
      src: "/public/lovable-uploads/1ebf712a-3070-4abd-b738-09ed2c4a6d09.png",
      alt: "DDX TrustTrees Visualization",
      caption: "Advanced TrustTrees visualization for supply chain dependency mapping"
    },
    {
      src: "/public/lovable-uploads/051a0085-f9a9-4723-ac0b-3c746a4cedd8.png",
      alt: "DDX Dashboard Overview",
      caption: "Organization overview dashboard with risk metrics and threat actor geo-location"
    },
    {
      src: "/public/photo-1461749280684-dccba630e2f6.jpg",
      alt: "DDX Code Analysis",
      caption: "Deep code analysis and vulnerability scanning"
    },
    {
      src: "/public/photo-1487058792275-0ad4aaf24ca7.jpg",
      alt: "DDX Dependency Mapping",
      caption: "Detailed software dependency mapping and analysis"
    },
    {
      src: "/public/photo-1498050108023-c5249f4df085.jpg",
      alt: "DDX Reporting Interface",
      caption: "Comprehensive reporting and forensic analysis results"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [screenshots.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % screenshots.length
    );
  };

  return (
    <div className="bg-[#f3f3f3] p-8 rounded-xl mb-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">DDX</h1>
      <p className="text-center mb-8 max-w-3xl mx-auto text-lg">
        Cyber Supply Chain Forensic Inspection Platform - Visualize the powerful interface of DDX with its comprehensive dashboards, dependency mapping, and advanced threat detection capabilities.
      </p>

      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-hidden rounded-lg shadow-lg bg-black">
          {/* Image carousel */}
          <div className="relative aspect-video">
            {screenshots.map((screenshot, index) => (
              <div 
                key={index}
                className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <img 
                  src={screenshot.src} 
                  alt={screenshot.alt} 
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button 
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Caption */}
        <div className="bg-black/70 text-white p-3 absolute bottom-0 left-0 right-0 text-center">
          {screenshots[currentIndex].caption}
        </div>
        
        {/* Dots indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-[#cc0c1a]" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagram;
