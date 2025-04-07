
import React from 'react';
import { Link } from 'react-router-dom';

const PerpetualCallToAction = () => {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Ready to secure your products continuously?</h2>
      <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
        Contact us today to learn how our Product Security Perpetual Evaluation service can help protect your organization against evolving cyber threats.
      </p>
      <Link 
        to="/contact" 
        className="bg-[#cc0c1a] hover:bg-[#a80916] text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 inline-flex items-center"
      >
        Request a Demo
      </Link>
      <p className="mt-4 text-sm text-muted-foreground">
        © 2025 Tophat Security Inc - Product Security Perpetual Evaluation - www.tophatsecurity.com
      </p>
    </div>
  );
};

export default PerpetualCallToAction;
