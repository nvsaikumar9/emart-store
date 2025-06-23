
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, ShoppingBag } from 'lucide-react';

interface LoginFormProps {
  userType?: 'vendor';
}

export const LoginForm: React.FC<LoginFormProps> = ({ userType = 'vendor' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
      <Card className="w-full max-w-md shadow-2xl gradient-card border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 gradient-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-black text-gray-800 mb-3">
            3D Product Showcase
          </CardTitle>
          <p className="text-gray-700 text-lg font-medium">
            Sign in to manage your products
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-lg"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-lg"
                  required
                />
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-center bg-red-100 p-4 rounded-lg font-medium border border-red-300">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-14 gradient-primary hover:opacity-90 text-white font-bold text-lg shadow-lg"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
