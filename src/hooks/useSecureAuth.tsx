
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hardcoded credentials for single vendor
const VENDOR_EMAIL = 'vendor@demo.com';
const VENDOR_PASSWORD = 'vendor123';

export const useSecureAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Check hardcoded credentials
      if (email.trim().toLowerCase() === VENDOR_EMAIL && password === VENDOR_PASSWORD) {
        // Create a mock session for the hardcoded vendor
        const mockUser = {
          id: 'vendor-001',
          email: VENDOR_EMAIL,
          role: 'vendor'
        };
        
        // Store in localStorage for persistence
        localStorage.setItem('vendor_session', JSON.stringify(mockUser));
        
        return { user: mockUser };
      } else {
        throw new Error('Invalid credentials. Use: vendor@demo.com / vendor123');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    // For single vendor system, signup is not needed
    throw new Error('Registration is not available. Use the provided vendor credentials.');
  };

  return {
    signIn,
    signUp,
    loading,
    error,
    clearError: () => setError(null)
  };
};
