
import React from 'react';
import ContactInfo from '@/components/ContactInfo';

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or want to work with us? Contact us using one of the methods below.
          </p>
        </div>

        <div className="mx-auto max-w-3xl animate-slide-up opacity-0" style={{ animationDelay: '200ms' }}>
          <ContactInfo />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
