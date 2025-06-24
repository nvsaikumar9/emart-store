
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description?: string;
  price: number;
  status: 'draft' | 'published';
  images: string[];
}

export const useProducts = (showOnlyPublished = false) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, sort_order)
        `);

      if (showOnlyPublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        vendor_id: product.vendor_id,
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status as 'draft' | 'published',
        images: product.product_images
          ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((img: any) => img.image_url) || []
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (productData: Partial<Product>) => {
    if (!user?.id) return;

    try {
      // First get or create vendor
      let { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!vendor) {
        const { data: newVendor, error: vendorError } = await supabase
          .from('vendors')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        
        if (vendorError) throw vendorError;
        vendor = newVendor;
      }

      const { data: product, error } = await supabase
        .from('products')
        .upsert({
          id: productData.id,
          vendor_id: vendor.id,
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          status: productData.status || 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      // Handle images
      if (productData.images && productData.images.length > 0) {
        // Delete existing images
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', product.id);

        // Insert new images
        const imageInserts = productData.images.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          sort_order: index
        }));

        await supabase
          .from('product_images')
          .insert(imageInserts);
      }

      await fetchProducts();
      return product;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();

    // Set up real-time subscription
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showOnlyPublished]);

  return {
    products,
    loading,
    saveProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
