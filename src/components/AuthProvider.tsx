
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  role: 'vendor' | 'customer';
  businessName?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateVendorDetails: (details: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: 'vendor' // For now, all users are vendors
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: 'vendor'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, use hardcoded credentials
    if (email === 'n.v.saikumar9@gmail.com' && password === '7095770758') {
      // Sign up or sign in the demo user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error && error.message.includes('Invalid login credentials')) {
        // User doesn't exist, let's sign them up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          console.error('Sign up error:', signUpError);
          throw new Error('Authentication failed');
        }
      } else if (error) {
        console.error('Sign in error:', error);
        throw new Error('Authentication failed');
      }
    } 
    // Customer login (demo customer)
    else if (email === 'customer@example.com' && password === 'customer123') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error && error.message.includes('Invalid login credentials')) {
        // User doesn't exist, let's sign them up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          console.error('Sign up error:', signUpError);
          throw new Error('Authentication failed');
        }
      } else if (error) {
        console.error('Sign in error:', error);
        throw new Error('Authentication failed');
      }
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const updateVendorDetails = (details: Partial<User>) => {
    if (user && user.role === 'vendor') {
      setUser({ ...user, ...details });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateVendorDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
