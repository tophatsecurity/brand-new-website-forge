
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Account Pending Approval</h1>
          <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-8 mt-8">
            <p className="text-lg mb-4">
              Your account is currently pending administrator approval. You'll receive an email once your account has been approved.
            </p>
            <p className="mb-6">
              For urgent assistance or to expedite the approval process, please contact our support team.
            </p>
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PendingApproval;
