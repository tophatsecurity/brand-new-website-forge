
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
            <p className="text-md text-muted-foreground mb-2 text-center max-w-3xl">
              Beyond the standard Software Bill of Materials (SBOM), our XBOM platform unifies:
              <br />
              <span className="font-semibold">
                Hardware Bill of Materials (HBOM)&nbsp;|&nbsp;
                Software Bill of Materials (SBOM)&nbsp;|&nbsp;
                Firmware Bill of Materials (FWBOM)&nbsp;|&nbsp;
                Forensics Bill of Materials (FBOM)
              </span>
              <br />
              Gain deep, forensics-level clarity in your supply chain. 
            </p>
            <p className="mt-2 text-center text-sm max-w-xl text-muted-foreground">
              <span className="font-bold text-[#cc0c1a]">We don't need vendor attestation-based BOMs:</span>
              Most solutions rely on what vendors claim about their components. With XBOM, you get independent, in-depth analysis—so you know what others aren’t saying about their BOMs.
            </p>
            <p className="mt-2 text-center text-xs text-muted-foreground italic max-w-xl">
              Discover the truth hiding in your supply chain—know what’s inside, not just what’s declared.
            </p>
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
