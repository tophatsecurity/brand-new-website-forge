
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SecondLookSection from '@/components/SecondLookSection';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileCheck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const SecondLook = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
              Advanced Security Solutions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SecondLook Security Platform</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Comprehensive security monitoring and supply chain intelligence
            </p>
            
            <div className="flex justify-center">
              <Link to="/contact">
                <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                  Request a Demo
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="relative w-full max-w-4xl">
                <div className="absolute inset-0 blur-lg bg-gradient-to-r from-[#cc0c1a]/20 to-[#222]/20 rounded-2xl transform -rotate-6"></div>
                <div className="relative bg-white rounded-xl overflow-hidden border p-8 shadow-md">
                  <img 
                    src="/lovable-uploads/1428d007-5f52-4f4a-bd6a-d65352b9db3d.png" 
                    alt="SecondLook Security Dashboard" 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="passive" className="w-full max-w-4xl mx-auto mb-12">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="passive" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>SecondLook X</span>
              </TabsTrigger>
              <TabsTrigger value="sbom" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>SBOM Platform</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="passive">
              <div className="flex justify-center mb-16">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 blur-lg bg-gradient-to-r from-[#cc0c1a]/20 to-[#222]/20 rounded-2xl transform -rotate-6"></div>
                  <div className="relative bg-white rounded-xl overflow-hidden border p-8 shadow-md flex flex-col items-center">
                    <div className="bg-white p-2 rounded-full mb-6">
                      <img 
                        src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png" 
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
            </TabsContent>
            
            <TabsContent value="sbom">
              <div className="flex justify-center mb-16">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 blur-lg bg-gradient-to-r from-[#cc0c1a]/20 to-[#222]/20 rounded-2xl transform -rotate-6"></div>
                  <div className="relative bg-white rounded-xl overflow-hidden border p-8 shadow-md flex flex-col items-center">
                    <div className="bg-white p-2 rounded-full mb-6">
                      <img 
                        src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png" 
                        alt="SecondLook SBOM Platform" 
                        className="h-40 md:h-48"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">SecondLook SBOM Platform</h3>
                    <p className="text-center text-muted-foreground">
                      Comprehensive bill of materials intelligence for software, hardware, and firmware
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <SecondLookSection />
      </div>
      <Footer />
    </div>
  );
};

export default SecondLook;
