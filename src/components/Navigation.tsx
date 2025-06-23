
import React from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { LogOut, Package, Settings, Home, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const vendorTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'profile', label: 'Business Profile', icon: User },
  ];

  return (
    <nav className="gradient-primary shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-white">
              3D Product Showcase
            </h1>
            <div className="flex space-x-4">
              {vendorTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'gradient-yellow text-gray-800 border border-yellow-400'
                        : 'text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white text-opacity-90">
              {user?.email}
            </span>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-white border-opacity-30 text-white hover:bg-white hover:text-blue-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
