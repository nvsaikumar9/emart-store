-- Add minimum_lot column to products table
ALTER TABLE public.products 
ADD COLUMN minimum_lot integer DEFAULT 1;

-- Add comment for clarity
COMMENT ON COLUMN public.products.minimum_lot IS 'Minimum number of units that must be ordered';