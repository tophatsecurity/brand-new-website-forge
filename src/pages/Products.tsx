
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
        <div className="bg-white py-12">
          <ProductCategories />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
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
