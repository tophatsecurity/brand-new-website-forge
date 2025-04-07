
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SecondLookSection from '@/components/SecondLookSection';
import { Badge } from '@/components/ui/badge';

const SecondLook = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
              Advanced Security Solution
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SecondLook X</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Passive monitoring with automated alerts for enhanced cybersecurity
            </p>
          </div>
          
          <div className="flex justify-center mb-16">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 blur-lg bg-gradient-to-r from-[#cc0c1a]/20 to-[#222]/20 rounded-2xl transform -rotate-6"></div>
              <div className="relative bg-white rounded-xl overflow-hidden border p-8 shadow-md flex flex-col items-center">
                <div className="bg-white p-2 rounded-full mb-6">
                  <img 
                    src="/public/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png" 
                    alt="SecondLook Security" 
                    className="h-40 md:h-48"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">SecondLook X</h3>
                <p className="text-center text-muted-foreground">
                  Protection against the 65% of attacks that traditional systems miss
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <SecondLookSection />
      </div>
      <Footer />
    </div>
  );
};

export default SecondLook;
