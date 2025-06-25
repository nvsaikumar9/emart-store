
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

// Type assertion to work around the types sync issue
type VendorRow = {
  id: string;
  user_id: string;
  business_name: string | null;
  contact_person: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export const useVendor = () => {
  const { user } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVendor = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching vendor for user ID:', user.id);
      const { data, error } = await (supabase as any)
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching vendor:', error);
        setVendor(null);
      } else {
        console.log('Fetched vendor data:', data);
        const vendorData = data as VendorRow | null;
        if (vendorData) {
          setVendor({
            id: vendorData.id,
            user_id: vendorData.user_id,
            business_name: vendorData.business_name || undefined,
            contact_person: vendorData.contact_person || undefined,
            phone: vendorData.phone || undefined,
            address: vendorData.address || undefined,
            website: vendorData.website || undefined,
            description: vendorData.description || undefined
          });
        } else {
          setVendor(null);
        }
      }
    } catch (error) {
      console.error('Error fetching vendor:', error);
      setVendor(null);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateVendor = async (vendorData: Partial<Vendor>) => {
    if (!user?.id) {
      console.error('No user ID available for vendor operation');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Saving vendor data:', vendorData, 'for user:', user.id);
      
      const dataToSave = {
        user_id: user.id,
        business_name: vendorData.business_name || null,
        contact_person: vendorData.contact_person || null,
        phone: vendorData.phone || null,
        address: vendorData.address || null,
        website: vendorData.website || null,
        description: vendorData.description || null
      };

      const { data, error } = await (supabase as any)
        .from('vendors')
        .upsert(dataToSave, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving vendor:', error);
        throw error;
      }

      console.log('Vendor saved successfully:', data);
      const savedVendor = data as VendorRow;
      const formattedVendor: Vendor = {
        id: savedVendor.id,
        user_id: savedVendor.user_id,
        business_name: savedVendor.business_name || undefined,
        contact_person: savedVendor.contact_person || undefined,
        phone: savedVendor.phone || undefined,
        address: savedVendor.address || undefined,
        website: savedVendor.website || undefined,
        description: savedVendor.description || undefined
      };
      
      setVendor(formattedVendor);
      return formattedVendor;
    } catch (error) {
      console.error('Error saving vendor:', error);
      throw error;
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
