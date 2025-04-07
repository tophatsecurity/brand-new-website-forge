
import React from 'react';
import Navbar from '@/components/Navbar';
import ProductsSection from '@/components/ProductsSection';
import ProductCategories from '@/components/ProductCategories';
import SecondLookSection from '@/components/SecondLookSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileCheck } from "lucide-react";

const Products = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Security Solutions</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive cybersecurity platforms designed for AI Security, Supply Chain Security, and Industrial Asset Management.
            </p>
          </div>
          
          {/* Product Categories Card */}
          <div className="mb-16 p-8 border border-gray-200 rounded-xl shadow-lg bg-white relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#cc0c1a]"></div>
            <ProductCategories />
          </div>
        </div>

        <Tabs defaultValue="products" className="max-w-7xl mx-auto px-6">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="products" className="flex-1">All Products</TabsTrigger>
            <TabsTrigger value="secondlook" className="flex-1 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              <span>SecondLook X</span>
            </TabsTrigger>
            <TabsTrigger value="sbom" className="flex-1 flex items-center justify-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>SBOM Platform</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductsSection />
          </TabsContent>
          
          <TabsContent value="secondlook">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
                Advanced Security Solution
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">SecondLook X</h2>
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
            
            <SecondLookSection />
          </TabsContent>
          
          <TabsContent value="sbom">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
                Supply Chain Intelligence
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">SecondLook SBOM Platform</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive bill of materials intelligence for software, hardware, and firmware components
              </p>
            </div>
            
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
                    Complete visibility into your software, hardware, and firmware supply chain
                  </p>
                </div>
              </div>
            </div>
            
            <SecondLookSection />
          </TabsContent>
        </Tabs>
        
        <div className="text-center py-16 bg-[#f3f3f3] mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Need a Customized Security Solution?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Our experts can help you identify the right security tools for your specific needs.
          </p>
          <a href="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-2">
              Contact Our Team
            </Button>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
