
import React from 'react';

const CallToAction = () => {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Ready to enhance your network visibility?</h2>
      <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
        Contact us today to learn more about how SEEKCAP can provide mission-critical visibility to your network infrastructure.
      </p>
      <a 
        href="/contact" 
        className="bg-[#cc0c1a] hover:bg-[#a80916] text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 inline-flex items-center"
      >
        Request a Demo
      </a>
    </div>
  );
};

export default CallToAction;
