
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
