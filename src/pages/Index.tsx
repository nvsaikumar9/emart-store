
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { LoginForm } from '@/components/LoginForm';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ProductManager } from '@/components/ProductManager';
import { VendorProfile } from '@/components/VendorProfile';
import { PublicStorefront } from '@/components/PublicStorefront';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showStorefront, setShowStorefront] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !showStorefront) {
    return (
      <div>
        <div className="gradient-primary shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-white">3D Product Showcase</h1>
              <Button 
                onClick={() => setShowStorefront(true)}
                variant="outline"
                className="flex items-center space-x-2 border-white border-opacity-30 text-white hover:bg-white hover:text-blue-600"
              >
                <Store className="h-4 w-4" />
                <span>View Storefront</span>
              </Button>
            </div>
          </div>
        </div>
        <LoginForm />
      </div>
    );
  }

  if (showStorefront && !user) {
    return (
      <div>
        <div className="gradient-primary shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-white">3D Product Showcase</h1>
              <Button 
                onClick={() => setShowStorefront(false)}
                variant="outline"
                className="border-white border-opacity-30 text-white hover:bg-white hover:text-blue-600"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PublicStorefront />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManager />;
      case 'profile':
        return <VendorProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
