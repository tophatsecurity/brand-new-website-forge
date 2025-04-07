
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ComparisonTable = () => {
  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">ParaGuard vs. Traditional Security</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
          Unlike traditional EDR/XDR solutions, ParaGuard offers GPU-native security with deep AI workload monitoring.
        </p>
        
        <div className="overflow-x-auto mb-12">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Security Feature</TableHead>
                <TableHead className="w-1/3">Traditional EDR/XDR</TableHead>
                <TableHead className="w-1/3">ParaGuard AI D&R</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Kernel-Level Monitoring</TableCell>
                <TableCell>CPU-focused, lacks GPU hooks</TableCell>
                <TableCell className="text-primary">Includes GPU driver-level hooks</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GPU Firmware & Memory Security</TableCell>
                <TableCell>No visibility</TableCell>
                <TableCell className="text-primary">Detects firmware tampering & GPU memory corruption</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Application & AI Model Security</TableCell>
                <TableCell>Limited</TableCell>
                <TableCell className="text-primary">Identifies AI model inference and covert GPU processing</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Hypervisor & Shared Resource Protection</TableCell>
                <TableCell>Partially covers VMs</TableCell>
                <TableCell className="text-primary">Detects GPU-based escapes and hijacking</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
