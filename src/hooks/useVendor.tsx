
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface Vendor {
  id: string;
  user_id: string;
  business_name?: string;
  contact_person?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
}

export const useVendor = () => {
  const { user } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVendor = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching vendor:', error);
        return;
      }

      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateVendor = async (vendorData: Partial<Vendor>) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('vendors')
        .upsert({
          user_id: user.id,
          ...vendorData
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving vendor:', error);
        return;
      }

      setVendor(data);
    } catch (error) {
      console.error('Error saving vendor:', error);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [user?.id]);

  return {
    vendor,
    loading,
    createOrUpdateVendor,
    refetch: fetchVendor
  };
};
