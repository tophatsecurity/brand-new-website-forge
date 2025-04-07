
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NetworkDiagram = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenshots = [
    {
      src: "/public/lovable-uploads/1428d007-5f52-4f4a-bd6a-d65352b9db3d.png",
      alt: "SEEKCAP Network Diagram",
      caption: "SEEKCAP network visibility solution in action"
    },
    {
      src: "/public/lovable-uploads/fd6bff11-0891-4c38-b338-c5206949e416.png",
      alt: "SEEKCAP Settings Interface",
      caption: "Configure resource limits and safety settings"
    },
    {
      src: "/public/lovable-uploads/419792d2-adf5-47da-a03a-d6923163f3d0.png",
      alt: "SEEKCAP Performance Monitoring",
      caption: "Real-time system performance monitoring dashboard"
    },
    {
      src: "/public/lovable-uploads/dd0ec49a-05bc-41ea-85ed-d1280bf5c350.png",
      alt: "SEEKCAP Network Topology",
      caption: "Interactive network topology map with protocol filtering"
    },
    {
      src: "/public/lovable-uploads/a511ebb5-eb08-41fb-8517-00b96e1b0576.png",
      alt: "SEEKCAP Dashboard",
      caption: "Main dashboard with asset tracking and network statistics"
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
      <h2 className="text-2xl font-bold mb-6 text-center">SEEKCAP Interface</h2>
      <p className="text-center mb-8 max-w-3xl mx-auto">
        Experience the powerful interface of SEEKCAP with its intuitive dashboards, comprehensive network topology mapping, performance monitoring, and advanced settings.
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
      
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Screenshots of the SEEKCAP interface showing various features and capabilities
        </p>
      </div>
    </div>
  );
};

export default NetworkDiagram;
