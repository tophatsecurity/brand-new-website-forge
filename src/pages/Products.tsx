
import React from 'react';
import Navbar from '@/components/Navbar';
import ProductsSection from '@/components/ProductsSection';
import ProductCategories from '@/components/ProductCategories';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Products = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <div className="bg-gradient-to-r from-gray-100 to-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Security Solutions</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive cybersecurity platforms designed for AI Security, Cyber Supply Chain, and Asset Management solutions.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-12">
          <ProductCategories />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Detailed Product Information</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our comprehensive suite of cybersecurity products designed to protect your most critical assets
            </p>
          </div>
          <div className="mb-10 p-8 bg-secondary/60 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-[#cc0c1a]">XBOM (SBOM/HBOM/FWBOM/FBOM) Platform</h3>
          </div>
          <ProductsSection />
        </div>
        
        <div className="text-center py-16 bg-[#f3f3f3] mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Need a Customized Security Solution?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Our experts can help you identify the right security tools for your specific needs.
          </p>
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-2 text-lg">
              Contact Our Team
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
