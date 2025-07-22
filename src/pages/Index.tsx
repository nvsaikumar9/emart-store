
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { LoginForm } from '@/components/LoginForm';
import { Navigation } from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-foreground text-xl sm:text-2xl font-semibold">Loading GTraders...</p>
        </div>
      </div>
    );
  }

  // Show public storefront for guest view
  if (showStorefront) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">GTraders</h1>
              <Button 
                onClick={() => setShowStorefront(false)}
                variant="outline"
                className="btn-outline text-sm"
                size="sm"
              >
                Vendor Login
              </Button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <PublicStorefront />
        </main>
      </div>
    );
  }

  // Show vendor login if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4 sm:py-0 sm:h-20">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left tracking-tight">GTraders</h1>
              <Button 
                onClick={() => setShowStorefront(true)}
                variant="outline"
                className="btn-outline flex items-center justify-center space-x-2 text-sm"
                size="sm"
              >
                <Store className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>View Storefront</span>
              </Button>
            </div>
          </div>
        </header>
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
