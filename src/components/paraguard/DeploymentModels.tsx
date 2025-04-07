
import React from 'react';
import { Shield, Server, Zap, Database, Network, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DeploymentModels = () => {
  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Deployment Models</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
          ParaGuard seamlessly integrates into enterprise and cloud environments, ensuring scalable GPU security.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-background">
            <CardHeader>
              <div className="mb-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">EDR/XDR Extension</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Expands existing security platforms into GPU detection and response
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardHeader>
              <div className="mb-2">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">MDR & Managed Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fully managed AI infrastructure security
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardHeader>
              <div className="mb-2">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">OEM & API Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Embedded GPU security for AI applications
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardHeader>
              <div className="mb-2">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">IaaS Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Secure cloud AI workloads and confidential compute environments
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeploymentModels;
