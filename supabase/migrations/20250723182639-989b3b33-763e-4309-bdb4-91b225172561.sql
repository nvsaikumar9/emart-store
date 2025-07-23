-- Fix security issues for database functions by setting search_path
CREATE OR REPLACE FUNCTION generate_gtr_code() 
RETURNS text 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- Fix security issues for trigger function
CREATE OR REPLACE FUNCTION assign_product_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.product_code IS NULL THEN
        NEW.product_code := generate_gtr_code();
    END IF;
    RETURN NEW;
END;
$$;

-- Fix security issues for existing trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;