
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
      <main className="pt-32">
        <div className="hero-section">
          <div className="hero-content">
            <div className="text-center">
              <h1 className="hero-title">Our Security Solutions</h1>
              <p className="hero-description">
                Comprehensive cybersecurity platforms for today's evolving threat landscape.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <ProductCategories />
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
      </main>
      <Footer />
    </div>
  );
};

export default Products;
