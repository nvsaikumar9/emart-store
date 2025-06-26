
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Eye, Activity } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
  id: string;
  type: 'product_added' | 'product_deleted' | 'product_updated' | 'product_viewed' | 'order_placed';
  productName: string;
  timestamp: Date;
  description: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const [websiteViews, setWebsiteViews] = useState(12847);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Calculate total store worth (sum of all product prices)
  const totalStoreWorth = products.reduce((sum, product) => sum + product.price, 0);

  // Generate mock activity data based on products
  useEffect(() => {
    const generateRecentActivity = () => {
      if (products.length === 0) return [];

      const activities: ActivityItem[] = [];
      const now = new Date();

      // Generate some sample activities
      if (products.length > 0) {
        activities.push({
          id: '1',
          type: 'product_added',
          productName: products[0]?.name || 'New Product',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          description: `Product "${products[0]?.name || 'New Product'}" added 2 hours ago.`
        });
      }

      if (products.length > 1) {
        activities.push({
          id: '2',
          type: 'product_updated',
          productName: products[1]?.name || 'Product',
          timestamp: new Date(now.getTime() - 9 * 60 * 60 * 1000), // 9 hours ago
          description: `Product "${products[1]?.name || 'Product'}" details updated 9 hours ago.`
        });
      }

      if (products.length > 0) {
        activities.push({
          id: '3',
          type: 'product_viewed',
          productName: products[0]?.name || 'Product',
          timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
          description: `Your product "${products[0]?.name || 'Product'}" was viewed by a customer 15 minutes ago.`
        });
      }

      if (products.length > 2) {
        activities.push({
          id: '4',
          type: 'order_placed',
          productName: products[2]?.name || 'Product',
          timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
          description: `New order placed for "${products[2]?.name || 'Product'}" 30 minutes ago.`
        });
      }

      return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setRecentActivity(generateRecentActivity());
  }, [products]);

  // Simulate website views increment
  useEffect(() => {
    const interval = setInterval(() => {
      setWebsiteViews(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Store Worth',
      value: `₹${totalStoreWorth.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Website Views',
      value: websiteViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Recent Activity',
      value: recentActivity.length.toString(),
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.email}!</h2>
        <p className="text-gray-600">Here's an overview of your 3D product store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-start py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <span className="text-sm text-gray-800">{activity.description}</span>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          activity.type === 'product_added' ? 'bg-green-500' :
                          activity.type === 'product_updated' ? 'bg-blue-500' :
                          activity.type === 'product_deleted' ? 'bg-red-500' :
                          activity.type === 'product_viewed' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`} />
                        <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Activity will appear here as you add and manage products</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Store Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Products Published</span>
                <span className="text-sm text-gray-600">
                  {products.filter(p => p.status === 'published').length} of {products.length} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Store Views</span>
                <span className="text-sm text-gray-600">{websiteViews.toLocaleString()} total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Average Product Value</span>
                <span className="text-sm text-gray-600">
                  ₹{products.length > 0 ? (totalStoreWorth / products.length).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="pt-4">
                <div className="text-sm text-gray-600 mb-2">Platform Features:</div>
                <ul className="text-sm space-y-1">
                  <li>✓ Unlimited Products</li>
                  <li>✓ 3D/360° Viewer</li>
                  <li>✓ Analytics Dashboard</li>
                  <li>✓ Public Storefront</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
