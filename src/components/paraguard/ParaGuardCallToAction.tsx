
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, Lock } from "lucide-react";
import { Link } from 'react-router-dom';

const ParaGuardCallToAction = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Take Control of AI Security</h2>
        <p className="text-lg mb-12">
          ParaGuard sets a new standard for AI model and GPU infrastructure protection. Don't let blind spots in traditional security put your AI workloads at risk.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Enhance GPU Security</h3>
            <p className="text-gray-300">with real-time AI & GPU threat detection</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Prevent Model Tampering</h3>
            <p className="text-gray-300">& Inference Attacks</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stop GPU-Based Exploits</h3>
            <p className="text-gray-300">Before They Impact AI Integrity</p>
          </div>
        </div>
        
        <p className="text-xl mb-8">Ready to secure your AI infrastructure? Contact us today for a demo!</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact">
            <Button className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
              Contact Our Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParaGuardCallToAction;
