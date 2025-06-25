
import { z } from 'zod';

// Vendor profile validation schema
export const vendorProfileSchema = z.object({
  business_name: z.string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be less than 100 characters')
    .trim(),
  contact_person: z.string()
    .min(1, 'Contact person is required')
    .max(100, 'Contact person name must be less than 100 characters')
    .trim(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
  address: z.string()
    .max(500, 'Address must be less than 500 characters')
    .trim()
    .optional(),
  website: z.string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional()
});

// Product validation schema
export const productSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be less than 200 characters')
    .trim(),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .trim()
    .optional(),
  price: z.number()
    .min(0, 'Price must be greater than or equal to 0')
    .max(999999.99, 'Price must be less than 1,000,000'),
  status: z.enum(['draft', 'published']),
  images: z.array(z.string().url('Invalid image URL'))
    .max(150, 'Maximum 150 images allowed')
});

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate image URL
export const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};

export type VendorProfileInput = z.infer<typeof vendorProfileSchema>;
export type ProductInput = z.infer<typeof productSchema>;
