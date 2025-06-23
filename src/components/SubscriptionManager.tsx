
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap } from 'lucide-react';

export const SubscriptionManager = () => {
  const [currentPlan, setCurrentPlan] = useState('pro');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      icon: Zap,
      features: [
        'Up to 50 products',
        '3D/360° viewer',
        'Basic analytics',
        'Email support',
        '5GB storage'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      icon: Crown,
      features: [
        'Unlimited products',
        'Advanced 3D viewer',
        'Advanced analytics',
        'Priority support',
        '50GB storage',
        'Custom branding'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      icon: Crown,
      features: [
        'Everything in Pro',
        'White-label solution',
        'API access',
        '24/7 phone support',
        'Unlimited storage',
        'Custom integrations'
      ]
    }
  ];

  const handleUpgrade = (planId: string) => {
    console.log('Upgrading to plan:', planId);
    // In real app, integrate with Stripe
    setCurrentPlan(planId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Subscription Plans</h2>
        <p className="text-gray-600">Choose the plan that fits your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          
          return (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-lg transition-shadow ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              } ${isCurrentPlan ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className={`h-8 w-8 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    isCurrentPlan 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={() => !isCurrentPlan && handleUpgrade(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Subscription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Plan</h4>
              <p className="text-lg font-semibold capitalize">{currentPlan}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Next Billing Date</h4>
              <p className="text-lg">January 15, 2024</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
              <p className="text-lg">•••• •••• •••• 4242</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">Update Payment Method</Button>
              <Button variant="outline">Download Invoice</Button>
              <Button variant="destructive">Cancel Subscription</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
