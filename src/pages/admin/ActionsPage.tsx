import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, RefreshCcw, Database, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ActionsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("maintenance");
  const [running, setRunning] = useState<Record<string, boolean>>({});
  
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const runAction = (actionName: string) => {
    setRunning(prev => ({ ...prev, [actionName]: true }));
    
    setTimeout(() => {
      setRunning(prev => ({ ...prev, [actionName]: false }));
      toast({
        title: "Action completed",
        description: `${actionName} completed successfully.`,
      });
    }, 2000);
  };

  return (
    <AdminLayout title="System Actions">
      <div className="flex justify-end mb-4">
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          System Status: Healthy
        </Badge>
      </div>
      
      <Tabs defaultValue="maintenance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCcw className="h-5 w-5" />
                  System Update
                </CardTitle>
                <CardDescription>
                  Check for system updates and apply them.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: 2025-04-28 14:32
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => runAction("System Update")}
                  disabled={running["System Update"]}
                >
                  {running["System Update"] ? "Checking..." : "Check for Updates"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Scheduled Tasks
                </CardTitle>
                <CardDescription>
                  Manage and run scheduled maintenance tasks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  3 tasks scheduled for the next 24 hours.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => runAction("Run Scheduled Tasks")}
                  disabled={running["Run Scheduled Tasks"]}
                >
                  {running["Run Scheduled Tasks"] ? "Running..." : "Run Now"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="database">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Maintenance
                </CardTitle>
                <CardDescription>
                  Optimize database performance and integrity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Last optimization: 2025-05-01 09:15
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => runAction("Database Optimization")}
                  disabled={running["Database Optimization"]}
                >
                  {running["Database Optimization"] ? "Optimizing..." : "Optimize Now"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  System Backup
                </CardTitle>
                <CardDescription>
                  Create and manage system backups.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Last backup: 2025-05-04 23:00
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => runAction("Create Backup")}
                  disabled={running["Create Backup"]}
                >
                  {running["Create Backup"] ? "Creating..." : "Create Backup"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Audit
                </CardTitle>
                <CardDescription>
                  Run a comprehensive security audit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Last audit: 2025-04-25 16:30
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => runAction("Security Audit")}
                  disabled={running["Security Audit"]}
                >
                  {running["Security Audit"] ? "Auditing..." : "Run Audit"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Reset Permissions
                </CardTitle>
                <CardDescription>
                  Reset all system permissions to defaults.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 text-yellow-600">
                  Warning: This will reset all custom permissions.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive"
                  onClick={() => runAction("Reset Permissions")}
                  disabled={running["Reset Permissions"]}
                >
                  {running["Reset Permissions"] ? "Resetting..." : "Reset Permissions"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ActionsPage;
