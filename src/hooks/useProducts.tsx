
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
      console.log('Fetching products, showOnlyPublished:', showOnlyPublished);
      
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
        setProducts([]);
        return;
      }

      console.log('Raw products data:', data);

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

      console.log('Formatted products:', formattedProducts);
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (productData: Partial<Product>) => {
    if (!user?.id) {
      console.error('No user authenticated for product save');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Saving product:', productData, 'for user:', user.id);
      
      // First ensure vendor exists
      let { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!vendor) {
        console.log('Creating vendor for user:', user.id);
        const { data: newVendor, error: vendorError } = await supabase
          .from('vendors')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        
        if (vendorError) {
          console.error('Error creating vendor:', vendorError);
          throw vendorError;
        }
        vendor = newVendor;
      }

      console.log('Using vendor:', vendor);

      // Save product
      const productToSave = {
        id: productData.id,
        vendor_id: vendor.id,
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        status: productData.status || 'draft'
      };

      const { data: product, error } = await supabase
        .from('products')
        .upsert(productToSave)
        .select()
        .single();

      if (error) {
        console.error('Error saving product:', error);
        throw error;
      }

      console.log('Product saved:', product);

      // Handle images if provided
      if (productData.images && productData.images.length > 0) {
        console.log('Saving product images:', productData.images);
        
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

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imageError) {
          console.error('Error saving images:', imageError);
        } else {
          console.log('Images saved successfully');
        }
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
      console.log('Deleting product:', productId);
      
      // Delete images first
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      // Delete product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }

      console.log('Product deleted successfully');
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
          console.log('Products changed, refetching...');
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
