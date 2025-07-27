
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/hooks/useProducts';
import { Package, Eye, DollarSign, Activity, TrendingUp, ShoppingCart, Users, Star } from 'lucide-react';

const Dashboard = () => {
  const { products, loading } = useProducts();
  const [websiteViews] = useState(1247); // Static for now
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, message: "Welcome to your dashboard", time: "Just now", type: "info" }
  ]);

  // Calculate metrics from products
  const totalProducts = products?.length || 0;
  const publishedProducts = products?.filter(p => p.status === 'published').length || 0;
  const totalStoreWorth = products?.reduce((sum, product) => sum + (product.price || 0), 0) || 0;

  // Add activity when products change (but limit frequency)
  useEffect(() => {
    if (products && products.length > 0) {
      const lastProduct = products[products.length - 1];
      if (lastProduct.name) {
        const newActivity = {
          id: Date.now(),
          message: `Product "${lastProduct.name}" status: ${lastProduct.status}`,
          time: "Recently",
          type: "product" as const
        };
        
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]); // Keep only 5 items
      }
    }
  }, [products?.length]); // Only trigger when products count changes

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background via-muted/30 to-accent/20 min-h-screen">
      {/* Header Section with Infographic Style */}
      <div className="text-center space-y-4 fade-in-up">
        <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Visual insights and analytics for your GTRADERS COLLECTION store
        </p>
      </div>

      {/* Key Metrics with Infographic Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products Card */}
        <div className="infographic-card scale-in">
          <div className="infographic-metric gradient-metric-primary">
            <Package className="infographic-icon" />
            <div className="infographic-stat-number">{totalProducts}</div>
            <div className="infographic-stat-label">Total Products</div>
            <div className="infographic-data-point mt-4">
              <Star className="w-4 h-4 text-success" />
              <span>{publishedProducts} Live Products</span>
            </div>
          </div>
        </div>

        {/* Website Views Card */}
        <div className="infographic-card scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="infographic-metric gradient-metric-secondary">
            <Eye className="infographic-icon" />
            <div className="infographic-stat-number">{websiteViews.toLocaleString()}</div>
            <div className="infographic-stat-label">Website Views</div>
            <div className="infographic-progress-bar mt-4">
              <div 
                className="infographic-progress-fill" 
                style={{ width: '75%' }}
              />
            </div>
            <span className="text-xs text-muted-foreground mt-2 block">75% of monthly target</span>
          </div>
        </div>

        {/* Store Worth Card */}
        <div className="infographic-card scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="infographic-metric gradient-metric-success">
            <DollarSign className="infographic-icon" />
            <div className="infographic-stat-number">₹{(totalStoreWorth / 1000).toFixed(0)}K</div>
            <div className="infographic-stat-label">Store Value</div>
            <div className="infographic-badge mt-4">
              <TrendingUp className="w-3 h-3" />
              Growing Portfolio
            </div>
          </div>
        </div>

        {/* Performance Score Card */}
        <div className="infographic-card scale-in" style={{ animationDelay: '0.3s' }}>
          <div className="infographic-metric bg-gradient-to-br from-warning-light to-warning/20">
            <Activity className="infographic-icon" />
            <div className="infographic-stat-number">92</div>
            <div className="infographic-stat-label">Performance Score</div>
            <div className="flex items-center justify-center mt-4 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= 4 ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Infographic-style Activity and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Timeline */}
        <div className="lg:col-span-2">
          <Card className="infographic-card h-full">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Activity Timeline
              </CardTitle>
              <CardDescription className="text-lg">
                Latest updates and store events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4 hover-lift">
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full mt-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 bg-gradient-to-r from-muted/50 to-accent/30 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    <Badge 
                      variant={activity.type === 'product' ? 'default' : 'secondary'}
                      className="mt-2 infographic-badge"
                    >
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Panel */}
        <div className="space-y-6">
          <Card className="infographic-card">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">Store Analytics</CardTitle>
              <CardDescription>Performance breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Published vs Draft */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-success" />
                    Published
                  </span>
                  <span className="infographic-stat-number text-lg">{publishedProducts}</span>
                </div>
                <div className="infographic-progress-bar">
                  <div 
                    className="infographic-progress-fill bg-gradient-to-r from-success to-success/80" 
                    style={{ width: `${totalProducts > 0 ? (publishedProducts / totalProducts) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <Separator />

              {/* Draft Products */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Package className="w-4 h-4 text-warning" />
                    In Draft
                  </span>
                  <span className="infographic-stat-number text-lg">{totalProducts - publishedProducts}</span>
                </div>
                <div className="infographic-progress-bar">
                  <div 
                    className="infographic-progress-fill bg-gradient-to-r from-warning to-warning/80" 
                    style={{ width: `${totalProducts > 0 ? ((totalProducts - publishedProducts) / totalProducts) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <Separator />

              {/* Average Price */}
              <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <div className="text-2xl font-black text-primary">
                  ₹{totalProducts > 0 ? Math.round(totalStoreWorth / totalProducts).toLocaleString('en-IN') : 0}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Average Product Price</div>
              </div>

              {/* Customer Satisfaction */}
              <div className="text-center p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Users className="w-8 h-8 text-success" />
                </div>
                <div className="text-xl font-bold text-success">4.8/5</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
