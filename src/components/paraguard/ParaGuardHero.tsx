
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const ParaGuardHero = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2">
            <Badge variant="outline" className="bg-primary/10 text-primary mb-4">AI Security</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">ParaGuard AI Security Platform</h1>
            <p className="text-xl text-gray-300 mb-8">
              Comprehensive AI security platform from AI Hardware to Model security.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                  Request a Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-center">
              <img 
                src="/lovable-uploads/627629f2-285b-4e9e-91c2-8baf0461d459.png" 
                alt="ParaGuard Dashboard" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParaGuardHero;
