
import React from 'react';
import { Cpu, ShieldCheck, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DetectionCapabilities = () => {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">Advanced Detection Capabilities</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-background border-t-4 border-t-primary">
            <CardHeader>
              <div className="mb-2">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>eBPF + PARAGUARD Synergy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Extends kernel-level security to GPUs, providing comprehensive system-wide protection.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-t-4 border-t-primary">
            <CardHeader>
              <div className="mb-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Real-Time AI Model Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stops model manipulation, unauthorized inference changes, and adversarial AI attacks.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-t-4 border-t-primary">
            <CardHeader>
              <div className="mb-2">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>GPU Rootkit & Malware Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Protects against stealthy GPU-based threats like Jellyfish Rootkit, CodeTalker, and TensorHack.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetectionCapabilities;
