import React from 'react';
import ContactInfo from '@/components/ContactInfo';
import ContactForm from '@/components/ContactForm';

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or want to work with us? Fill out the form below or contact us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-slide-up opacity-0" style={{ animationDelay: '100ms' }}>
            <ContactForm />
          </div>
          <div className="animate-slide-up opacity-0" style={{ animationDelay: '200ms' }}>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
