
-- Fix critical RLS policy issues

-- Add missing DELETE policy for vendors table
CREATE POLICY "Vendors can delete their own data" ON public.vendors
  FOR DELETE USING (auth.uid() = user_id);

-- Fix INSERT policy for products with proper WITH CHECK clause
DROP POLICY IF EXISTS "Vendors can insert their own products" ON public.products;
CREATE POLICY "Vendors can insert their own products" ON public.products
  FOR INSERT WITH CHECK (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
  );

-- Fix INSERT policy for product_images with proper WITH CHECK clause  
DROP POLICY IF EXISTS "Vendors can insert their own product images" ON public.product_images;
CREATE POLICY "Vendors can insert their own product images" ON public.product_images
  FOR INSERT WITH CHECK (
    product_id IN (
      SELECT id FROM public.products 
      WHERE vendor_id IN (
        SELECT id FROM public.vendors WHERE user_id = auth.uid()
      )
    )
  );
