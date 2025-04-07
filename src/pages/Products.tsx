
import React from 'react';
import Navbar from '@/components/Navbar';
import ProductsSection from '@/components/ProductsSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Products = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Security Solutions</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Cutting-edge cybersecurity platforms designed to protect critical infrastructure,
              military operations, and enterprise networks from advanced threats.
            </p>
          </div>
        </div>
        <ProductsSection />
        <div className="text-center py-16 bg-[#f3f3f3]">
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
