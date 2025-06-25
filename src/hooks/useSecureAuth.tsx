
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSecureAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // Don't expose detailed auth errors to users
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account');
        } else {
          throw new Error('Authentication failed. Please try again.');
        }
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        throw new Error('Account creation failed. Please try again.');
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Account creation failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    loading,
    error,
    clearError: () => setError(null)
  };
};
