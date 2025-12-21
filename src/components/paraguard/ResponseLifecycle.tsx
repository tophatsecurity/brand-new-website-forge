
import React from 'react';
import { CircleCheck, Shield, Cpu, Zap, Server } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ResponseLifecycle = () => {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">PARAGUARD in Action: Response Lifecycle</h2>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="identify">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-5 w-5 text-primary" />
                  <span>Identify</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Discover GPU assets and AI workloads at risk
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="protect">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Protect</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Deploy AI Systems detection and response agents
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="detect">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <span>Detect</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Monitor GPU activity, firmware, drivers, memory, and Detection & Response AI models including NLP, LLM, Deep Learning, Neural Networks, AI Vision
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="respond">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>Respond</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Trigger automated agents or manual playbooks for real-time security
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="recover">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <span>Recover</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Isolate threats and maintain operational continuity
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ResponseLifecycle;
