
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ProductsSection from '@/components/ProductsSection';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Link } from 'react-router-dom';

const Products = () => {
  useScrollToTop();
  
  return (
    <MainLayout fullWidth paddingTop="none">
      <div className="hero-section pt-32">
        <div className="hero-content">
          <div className="text-center">
            <h1 className="hero-title">Our Security Solutions</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
              Our innovative cybersecurity products safeguard your organization across multiple domains, 
              from AI systems to supply chain security and comprehensive asset management. Each solution 
              is designed to address emerging threats with cutting-edge technology.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <ProductsSection />

          <div className="text-center py-16 bg-gray-50 mt-16 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Need a Customized Security Solution?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Our experts can help you identify the right security tools for your specific needs.
            </p>
            <Link to="/contact">
              <button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white px-8 py-2 rounded-md">
                Contact Our Team
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
