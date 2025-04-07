
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import ProductCategories from '@/components/ProductCategories';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <div className="bg-gray-50">
        <ProductCategories />
      </div>
      <ProductsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
