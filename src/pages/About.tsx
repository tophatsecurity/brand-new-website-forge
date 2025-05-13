
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import AboutSection from '@/components/AboutSection';

const About = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <AboutSection />
      </div>
    </MainLayout>
  );
};

export default About;
