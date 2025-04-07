
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SecondLookSection from '@/components/SecondLookSection';

const SecondLook = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <SecondLookSection />
      </div>
      <Footer />
    </div>
  );
};

export default SecondLook;
