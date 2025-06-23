
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'vendor' | 'public';
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
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call - replace with actual authentication
    if (email === 'vendor@example.com' && password === 'vendor123') {
      const vendorUser = { 
        id: '1', 
        email: 'vendor@example.com', 
        role: 'vendor' as const,
        businessName: '',
        contactPerson: '',
        phone: '',
        address: '',
        website: '',
        description: ''
      };
      setUser(vendorUser);
      localStorage.setItem('user', JSON.stringify(vendorUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const updateVendorDetails = (details: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
