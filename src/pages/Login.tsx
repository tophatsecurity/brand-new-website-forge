
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Login to TopHat Security</h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
