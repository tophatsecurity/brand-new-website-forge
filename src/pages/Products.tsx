
import React from 'react';
import Navbar from '@/components/Navbar';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';

const Products = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="pt-24">
        <ServicesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Products;
