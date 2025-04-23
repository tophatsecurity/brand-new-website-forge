
import React from 'react';
import Navbar from '@/components/Navbar';
import ProductsSection from '@/components/ProductsSection';
import ProductCategories from '@/components/ProductCategories';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Products = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium text-[#cc0c1a] border-[#cc0c1a]">
              Our Products
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Security Solutions Portfolio</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Comprehensive security tools and platforms to protect your organization's assets
            </p>
            
            <div className="flex justify-center">
              <Link to="/contact">
                <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                  Request a Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-12 bg-muted/30 p-8 rounded-xl">
            <ProductCategories />
          </div>

          <ProductsSection />

          <div className="text-center py-16 bg-muted/30 mt-16 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Need a Customized Security Solution?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Our experts can help you identify the right security tools for your specific needs.
            </p>
            <Link to="/contact">
              <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
