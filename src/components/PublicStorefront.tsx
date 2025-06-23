
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductViewer3D } from './ProductViewer3D';
import { ShoppingCart, Eye, Phone, MapPin, Globe, User, Building } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface VendorInfo {
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  website: string;
  description: string;
}

export const PublicStorefront = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Sample vendor information - in real app, this would come from the authenticated vendor
  const vendorInfo: VendorInfo = {
    businessName: "Tech Gadgets Store",
    contactPerson: "John Smith",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street, Tech City, TC 12345",
    website: "www.techgadgets.com",
    description: "Your trusted partner for premium technology products. We specialize in cutting-edge gadgets and electronics with a focus on quality and customer satisfaction."
  };
  
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Smartphone',
      description: 'Latest flagship smartphone with advanced camera system and 5G connectivity. Experience the future of mobile technology.',
      price: 899.99,
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
    },
    {
      id: '2',
      name: 'Gaming Laptop Pro',
      description: 'High-performance gaming laptop with RTX graphics and 144Hz display. Built for serious gamers and content creators.',
      price: 1499.99,
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
    },
    {
      id: '3',
      name: 'Wireless Headphones',
      description: 'Premium noise-canceling headphones with 30-hour battery life. Crystal clear sound for music and calls.',
      price: 299.99,
      images: ['/placeholder.svg', '/placeholder.svg']
    }
  ];

  if (selectedProduct) {
    return (
      <div className="space-y-8">
        <Button 
          variant="outline" 
          onClick={() => setSelectedProduct(null)}
          className="mb-4 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          ← Back to Products
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Details - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <ProductViewer3D
              images={selectedProduct.images}
              productName={selectedProduct.name}
              className="h-[500px]"
            />
            
            <Card className="gradient-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">{selectedProduct.name}</h1>
                    <p className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                      ${selectedProduct.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button className="w-full gradient-primary hover:opacity-90 text-white" size="lg">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Product Features</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 360° interactive viewing experience</li>
                      <li>• High-resolution product images</li>
                      <li>• Zoom and rotate functionality</li>
                      <li>• Mobile-responsive design</li>
                      <li>• Detailed product specifications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Information - Takes 1 column */}
          <div className="space-y-6">
            <Card className="gradient-card border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="gradient-primary text-white p-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Vendor Information
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">{vendorInfo.businessName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{vendorInfo.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-700">{vendorInfo.contactPerson}</span>
                    </div>
                    
                    {vendorInfo.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={`tel:${vendorInfo.phone}`} className="text-blue-600 hover:underline">
                          {vendorInfo.phone}
                        </a>
                      </div>
                    )}
                    
                    {vendorInfo.address && (
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                        <span className="text-gray-700">{vendorInfo.address}</span>
                      </div>
                    )}
                    
                    {vendorInfo.website && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <a 
                          href={vendorInfo.website.startsWith('http') ? vendorInfo.website : `https://${vendorInfo.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {vendorInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    size="lg"
                  >
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-16 gradient-primary text-white rounded-2xl">
        <h1 className="text-5xl font-bold mb-4">
          3D Product Showcase
        </h1>
        <p className="text-xl max-w-2xl mx-auto opacity-90">
          Explore our products in stunning 3D detail. Rotate, zoom, and interact with each item for an immersive shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-0">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl overflow-hidden relative">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <Button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 gradient-primary hover:opacity-90 text-white"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View in 3D
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold gradient-secondary bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setSelectedProduct(product)}
                    className="gradient-primary hover:opacity-90 text-white"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
