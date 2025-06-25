
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';

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
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { signIn, error: authError, clearError } = useSecureAuth();

  useEffect(() => {
    // Check for stored vendor session
    const storedSession = localStorage.getItem('vendor_session');
    if (storedSession) {
      try {
        const userData = JSON.parse(storedSession);
        // Ensure the role is properly typed
        if (userData && (userData.role === 'vendor' || userData.role === 'customer')) {
          setUser(userData as User);
        } else {
          localStorage.removeItem('vendor_session');
        }
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('vendor_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      if (result.user) {
        // Ensure the user object has the correct role type
        const userWithCorrectRole: User = {
          ...result.user,
          role: result.user.role as 'vendor' | 'customer'
        };
        setUser(userWithCorrectRole);
      }
    } catch (error) {
      // Error is already handled by useSecureAuth hook
      throw error;
    }
  };

  const updateVendorDetails = (details: Partial<User>) => {
    if (user && user.role === 'vendor') {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      localStorage.setItem('vendor_session', JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('vendor_session');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      updateVendorDetails,
      authError,
      clearAuthError: clearError
    }}>
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
