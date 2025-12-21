import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import GuestOnboardingWizard from '@/components/onboarding/GuestOnboardingWizard';
import { useAuth } from '@/contexts/AuthContext';

const Onboarding: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Helmet>
        <title>Customer Onboarding | Top Hat Security</title>
        <meta name="description" content="Complete your onboarding to get started with Top Hat Security products and services." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : user ? (
              <OnboardingWizard />
            ) : (
              <GuestOnboardingWizard />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Onboarding;
