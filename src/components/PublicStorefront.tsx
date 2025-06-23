
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductViewer3D } from './ProductViewer3D';
import { ShoppingCart, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

export const PublicStorefront = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
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
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedProduct(null)}
          className="mb-4"
        >
          ← Back to Products
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductViewer3D
            images={selectedProduct.images}
            productName={selectedProduct.name}
            className="h-[500px]"
          />
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{selectedProduct.name}</h1>
              <p className="text-3xl font-bold text-green-600">${selectedProduct.price.toFixed(2)}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Contact Seller
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Product Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 360° interactive viewing</li>
                <li>• High-resolution product images</li>
                <li>• Zoom functionality</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          3D Product Showcase
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our products in stunning 3D detail. Rotate, zoom, and interact with each item.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow group">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <Button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View in 3D
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setSelectedProduct(product)}
                    className="bg-blue-600 hover:bg-blue-700"
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
