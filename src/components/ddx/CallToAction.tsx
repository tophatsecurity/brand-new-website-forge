
import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Ready to secure your software supply chain?</h2>
      <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
        Contact us today to learn more about how DDX can help identify and mitigate risks in your software supply chain.
      </p>
      <Link 
        to="/contact" 
        className="bg-[#cc0c1a] hover:bg-[#a80916] text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 inline-flex items-center"
      >
        Request a Demo
      </Link>
      <p className="mt-4 text-sm text-muted-foreground">
        © 2025 Tophat Security Inc - DDX - www.tophatsecurity.com
      </p>
    </div>
  );
};

export default CallToAction;
