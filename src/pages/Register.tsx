
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
