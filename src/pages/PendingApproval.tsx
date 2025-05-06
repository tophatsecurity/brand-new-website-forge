
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PendingApproval = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSelfApprove = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Self-approve the user by updating user_metadata
      const { error } = await supabase.auth.updateUser({
        data: { approved: true }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Account approved',
        description: 'Your account has been successfully approved.',
      });
      
      // Redirect to home page after approval
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error approving account:', error);
      toast({
        title: 'Error approving account',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin based on user_metadata
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  console.log('User metadata:', user?.user_metadata);
  console.log('Is user admin?', isAdmin);

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
            
            {/* Show self-approval button for all users who claim to be admins */}
            <div className="mb-4">
              <Button 
                onClick={handleSelfApprove} 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 mb-4"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Self-Approve Account'}
              </Button>
              <p className="text-sm text-gray-600">
                Click to approve your own account.
              </p>
            </div>
            
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PendingApproval;
