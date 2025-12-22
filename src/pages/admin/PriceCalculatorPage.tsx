import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import PriceCalculator from "@/components/admin/pricing/PriceCalculator";
import { Calculator } from 'lucide-react';

const PriceCalculatorPage = () => {
  const { user, isAdmin, userRoles } = useAuth();
  
  // Allow admin, var (partner), and customer_rep roles
  const allowedRoles = ['admin', 'var', 'customer_rep', 'account_rep'];
  const hasAccess = isAdmin || userRoles.some(role => allowedRoles.includes(role));
  
  if (!user || !hasAccess) {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout title="Price Calculator">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Price Calculator</h1>
            <p className="text-muted-foreground">Build quotes using catalog SKUs with discounts</p>
          </div>
        </div>
        
        <PriceCalculator />
      </div>
    </AdminLayout>
  );
};

export default PriceCalculatorPage;
