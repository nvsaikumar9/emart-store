-- Add product_code column to products table
ALTER TABLE public.products 
ADD COLUMN product_code text UNIQUE;

-- Create index on product_code for performance
CREATE INDEX idx_products_product_code ON public.products(product_code);

-- Create function to generate unique GTR product codes
CREATE OR REPLACE FUNCTION generate_gtr_code() 
RETURNS text 
LANGUAGE plpgsql 
AS $$
DECLARE
    new_code text;
    code_exists boolean;
BEGIN
    LOOP
        -- Generate GTR-XXXX-YYYY format with random alphanumeric characters
        new_code := 'GTR-' || 
                   upper(substring(md5(random()::text) from 1 for 4)) || '-' ||
                   upper(substring(md5(random()::text) from 1 for 4));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.products WHERE product_code = new_code) INTO code_exists;
        
        -- If code doesn't exist, we can use it
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$;

-- Create trigger to automatically generate product codes for new products
CREATE OR REPLACE FUNCTION assign_product_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.product_code IS NULL THEN
        NEW.product_code := generate_gtr_code();
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger for INSERT operations
CREATE TRIGGER trigger_assign_product_code
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION assign_product_code();

-- Update existing products with new product codes
UPDATE public.products 
SET product_code = generate_gtr_code() 
WHERE product_code IS NULL;