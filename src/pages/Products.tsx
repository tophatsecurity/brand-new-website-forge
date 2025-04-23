
import React from 'react';
import Navbar from '@/components/Navbar';
import ProductsSection from '@/components/ProductsSection';
import ProductCategories from '@/components/ProductCategories';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="bg-muted/30 py-12 rounded-lg mb-16">
          <ProductCategories />
        </div>

        <div className="max-w-7xl mx-auto">
          <ProductsSection />
        </div>
        
        <div className="text-center py-16 bg-muted/30 mt-16 rounded-lg">
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
      </main>
      <Footer />
    </div>
  );
};

export default Products;
