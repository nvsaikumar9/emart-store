
import React from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Eye, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Products',
      value: '12',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Monthly Revenue',
      value: '$2,450',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Views',
      value: '8,429',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Growth Rate',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

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
              {[
                { action: 'New product "Smartphone 360°" created', time: '2 hours ago' },
                { action: 'Product "Laptop Pro" updated', time: '4 hours ago' },
                { action: 'Product "Gaming Chair" published', time: '1 day ago' },
                { action: 'New customer viewed "Wireless Headphones"', time: '1 day ago' },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
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
                <span className="text-sm text-gray-600">12 items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Store Views</span>
                <span className="text-sm text-gray-600">8,429 this month</span>
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
