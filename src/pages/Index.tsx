
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
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white mx-auto"></div>
          <p className="mt-6 text-white text-2xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Show public storefront for guest view
  if (showStorefront) {
    return (
      <div>
        <div className="gradient-primary shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-black text-white">3D Product Showcase</h1>
              <Button 
                onClick={() => setShowStorefront(false)}
                className="btn-outline-visible"
              >
                Vendor Login
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

  // Show vendor login if no user
  if (!user) {
    return (
      <div>
        <div className="gradient-primary shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-black text-white">3D Product Showcase</h1>
              <Button 
                onClick={() => setShowStorefront(true)}
                className="btn-outline-visible flex items-center space-x-2"
              >
                <Store className="h-5 w-5" />
                <span>View Storefront</span>
              </Button>
            </div>
          </div>
        </div>
        <LoginForm />
      </div>
    );
  }

  // Show vendor dashboard if vendor is logged in
  if (user.role === 'vendor') {
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
  }

  return null;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
