
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { LoginForm } from '@/components/LoginForm';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ProductManager } from '@/components/ProductManager';
import { VendorProfile } from '@/components/VendorProfile';
import { PublicStorefront } from '@/components/PublicStorefront';
import { Button } from '@/components/ui/button';
import { Store, LogIn } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showStorefront, setShowStorefront] = useState(false);
  const [showCustomerLogin, setShowCustomerLogin] = useState(false);

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

  // Show customer login page
  if (showCustomerLogin && !user) {
    return (
      <div>
        <div className="gradient-primary shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-white">3D Product Showcase</h1>
              <Button 
                onClick={() => setShowCustomerLogin(false)}
                variant="outline"
                className="border-white border-opacity-30 text-white hover:bg-white hover:text-blue-600"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
        <LoginForm userType="customer" />
      </div>
    );
  }

  // Show public storefront for customers or guest storefront view
  if (showStorefront || (user && user.role === 'customer')) {
    return (
      <div>
        <div className="gradient-primary shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-white">3D Product Showcase</h1>
              <div className="flex items-center space-x-4">
                {user && user.role === 'customer' && (
                  <span className="text-sm text-white text-opacity-90">
                    Welcome, {user.email}
                  </span>
                )}
                {!user ? (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setShowCustomerLogin(true)}
                      variant="outline"
                      className="border-white border-opacity-30 text-white hover:bg-white hover:text-blue-600"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Customer Login
                    </Button>
                    <Button 
                      onClick={() => setShowStorefront(false)}
                      variant="outline"
                      className="border-white border-opacity-30 text-white hover:bg-white hover:text-blue-600"
                    >
                      Vendor Login
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      setShowStorefront(false);
                      setShowCustomerLogin(false);
                    }}
                    variant="outline"
                    className="border-white border-opacity-30 text-white hover:bg-white hover:text-blue-600"
                  >
                    {user.role === 'customer' ? 'Logout' : 'Back to Vendor'}
                  </Button>
                )}
              </div>
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
        <LoginForm userType="vendor" />
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
