
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const Licensing = () => {
  const { user } = useAuth();
  
  // This would typically come from your backend
  const dummyLicenses = [
    {
      id: 1,
      product: "SEEKCAP Enterprise",
      licenseKey: "SEEK-ENT-2024-XXXX",
      status: "Active",
      expiryDate: "2025-12-31",
      seats: 100,
    },
    {
      id: 2,
      product: "DDX Professional",
      licenseKey: "DDX-PRO-2024-XXXX",
      status: "Active",
      expiryDate: "2025-12-31",
      seats: 50,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">License Management</h1>
            <Button>Add New License</Button>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>License Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyLicenses.map((license) => (
                    <TableRow key={license.id}>
                      <TableCell>{license.product}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded">
                          {license.licenseKey}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          {license.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{license.expiryDate}</TableCell>
                      <TableCell>{license.seats}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-8 bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              If you're experiencing issues with your license or need to request additional seats,
              please contact our support team.
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:licensing@tophatsecurity.com">Contact Licensing Support</a>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Licensing;
