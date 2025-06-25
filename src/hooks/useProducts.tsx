
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

// Type assertions to work around the types sync issue
type ProductRow = {
  id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  product_images?: {
    image_url: string;
    sort_order: number;
  }[];
};

type VendorRow = {
  id: string;
  user_id: string;
};

export const useProducts = (showOnlyPublished = false) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products, showOnlyPublished:', showOnlyPublished);
      console.log('Current user:', user);
      
      let query = (supabase as any)
        .from('products')
        .select(`
          *,
          product_images(image_url, sort_order)
        `);

      if (showOnlyPublished) {
        query = query.eq('status', 'published');
        console.log('Filtering for published products only');
      } else if (user) {
        // For vendor view, only show their products
        const { data: vendor } = await (supabase as any)
          .from('vendors')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (vendor) {
          query = query.eq('vendor_id', (vendor as VendorRow).id);
          console.log('Filtering for vendor products:', (vendor as VendorRow).id);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        return;
      }

      console.log('Raw products data:', data);

      const formattedProducts: Product[] = (data as ProductRow[]).map(product => ({
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
      let { data: vendor } = await (supabase as any)
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!vendor) {
        console.log('Creating vendor for user:', user.id);
        const { data: newVendor, error: vendorError } = await (supabase as any)
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
        vendor_id: (vendor as VendorRow).id,
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        status: productData.status || 'draft'
      };

      const { data: product, error } = await (supabase as any)
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
        await (supabase as any)
          .from('product_images')
          .delete()
          .eq('product_id', (product as ProductRow).id);

        // Insert new images
        const imageInserts = productData.images.map((url, index) => ({
          product_id: (product as ProductRow).id,
          image_url: url,
          sort_order: index
        }));

        const { error: imageError } = await (supabase as any)
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
      await (supabase as any)
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      // Delete product
      const { error } = await (supabase as any)
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

  const publishProduct = async (productId: string) => {
    try {
      console.log('Publishing product:', productId);
      
      const { error } = await (supabase as any)
        .from('products')
        .update({ status: 'published' })
        .eq('id', productId);

      if (error) {
        console.error('Error publishing product:', error);
        throw error;
      }

      console.log('Product published successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Error publishing product:', error);
      throw error;
    }
  };

  const unpublishProduct = async (productId: string) => {
    try {
      console.log('Unpublishing product:', productId);
      
      const { error } = await (supabase as any)
        .from('products')
        .update({ status: 'draft' })
        .eq('id', productId);

      if (error) {
        console.error('Error unpublishing product:', error);
        throw error;
      }

      console.log('Product unpublished successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Error unpublishing product:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();

    // Set up real-time subscription
    const channel = (supabase as any)
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
  }, [showOnlyPublished, user?.id]);

  return {
    products,
    loading,
    saveProduct,
    deleteProduct,
    publishProduct,
    unpublishProduct,
    refetch: fetchProducts
  };
};
