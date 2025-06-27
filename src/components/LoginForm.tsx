
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/AuthProvider';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginForm = () => {
  const { login, loading, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState(''); // Removed pre-filled email
  const [password, setPassword] = useState(''); // Removed pre-filled password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    
    try {
      await login(email.trim(), password);
    } catch (error) {
      // Error is handled by the AuthProvider
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
    
    // Clear auth errors when user makes changes
    if (authError) {
      clearAuthError();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center gradient-primary text-white rounded-t-lg">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center justify-center">
            <LogIn className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            Vendor Login
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {authError && (
              <div className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-sm">{authError}</span>
              </div>
            )}
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="h-10 sm:h-12 text-sm sm:text-base"
                disabled={loading}
                autoComplete="email"
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Lock className="h-4 w-4 mr-2" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className="h-10 sm:h-12 text-sm sm:text-base"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-10 sm:h-12 gradient-primary text-white font-semibold text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
