
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import ProductCategories from '@/components/ProductCategories';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Index = () => {
  useScrollToTop();
  
  return (
    <MainLayout fullWidth paddingTop="none">
      <HeroSection />
      
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <ProductCategories />
          <div className="text-center mt-10">
            <Link to="/products">
              <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
        <ProductsSection />
        <div className="text-center mt-10">
          <Link to="/products">
            <Button variant="outline" className="border-[#cc0c1a] text-[#cc0c1a] hover:bg-[#cc0c1a] hover:text-white">
              Explore All Products
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Professional Services</h2>
          <p className="text-lg opacity-80 max-w-3xl mx-auto mb-10">
            Comprehensive security services delivered by experienced professionals to protect your organization's most valuable assets
          </p>
          <Link to="/services">
            <Button className="bg-white text-gray-900 hover:bg-gray-200">
              View Our Services
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
