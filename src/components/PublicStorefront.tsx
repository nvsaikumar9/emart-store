
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductViewer3D } from './ProductViewer3D';
import { useProducts, Product } from '@/hooks/useProducts';
import { useVendor } from '@/hooks/useVendor';
import { Eye, Phone, MapPin, Globe, User, Building } from 'lucide-react';

export const PublicStorefront = () => {
  const { products, loading } = useProducts(true); // Only show published products
  const { vendor } = useVendor();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Get vendor info or use defaults
  const vendorInfo = {
    businessName: vendor?.business_name || "Tech Gadgets Store",
    contactPerson: vendor?.contact_person || "Vendor Contact",
    phone: vendor?.phone || "+91 70957 70758",
    address: vendor?.address || "Business Address, India",
    website: vendor?.website || "www.example.com",
    description: vendor?.description || "Quality products and services for all your needs."
  };

  const contactSeller = () => {
    if (vendorInfo.phone) {
      window.open(`tel:${vendorInfo.phone}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="space-y-8">
        <Button 
          variant="outline" 
          onClick={() => setSelectedProduct(null)}
          className="btn-outline-visible mb-4"
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
            
            <Card className="gradient-card shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-800">{selectedProduct.name}</h1>
                    <div className="price-text text-2xl font-black">
                      ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Description</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="space-y-4 pt-6">
                    <Button 
                      className="w-full btn-visible text-lg py-4" 
                      size="lg"
                      onClick={contactSeller}
                    >
                      <Phone className="h-6 w-6 mr-3" />
                      Contact Seller to Purchase
                    </Button>
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Product Features</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        360° interactive viewing experience
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        High-resolution product images
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Zoom and rotate functionality
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Mobile-responsive design
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Detailed product specifications
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Information - Takes 1 column */}
          <div className="space-y-6">
            <Card className="gradient-card shadow-2xl">
              <CardContent className="p-0">
                <div className="gradient-primary text-white p-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <Building className="h-6 w-6 mr-3" />
                    Vendor Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-800 text-xl">{vendorInfo.businessName}</h4>
                    <p className="text-gray-600 mt-2 leading-relaxed">{vendorInfo.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="text-gray-800 font-medium">{vendorInfo.contactPerson}</span>
                    </div>
                    
                    {vendorInfo.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-green-600" />
                        <a href={`tel:${vendorInfo.phone}`} className="text-blue-600 hover:underline font-medium">
                          {vendorInfo.phone}
                        </a>
                      </div>
                    )}
                    
                    {vendorInfo.address && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-red-600 mt-0.5" />
                        <span className="text-gray-800">{vendorInfo.address}</span>
                      </div>
                    )}
                    
                    {vendorInfo.website && (
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-3 text-blue-600" />
                        <a 
                          href={vendorInfo.website.startsWith('http') ? vendorInfo.website : `https://${vendorInfo.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {vendorInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full btn-outline-visible py-3"
                    size="lg"
                    onClick={contactSeller}
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
    <div className="space-y-12">
      <div className="text-center py-20 gradient-primary text-white rounded-3xl shadow-2xl">
        <h1 className="text-6xl font-black mb-6">
          3D Product Showcase
        </h1>
        <p className="text-2xl max-w-3xl mx-auto opacity-95 leading-relaxed">
          Explore our products in stunning 3D detail. Rotate, zoom, and interact with each item for an immersive shopping experience.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-600 mb-4">No Products Available</h2>
          <p className="text-xl text-gray-500">Products will appear here once vendors publish them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => {
            const cardClass = index === 0 ? 'card-smartphone' : index === 1 ? 'card-laptop' : 'card-headphones';
            return (
              <Card key={product.id} className={`${cardClass} shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group`}>
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl overflow-hidden relative">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                        Product Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <Button
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn-visible py-3 px-6 shadow-lg"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        View in 3D
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="font-black text-2xl mb-4 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="price-text text-xl font-black">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      <Button
                        onClick={() => setSelectedProduct(product)}
                        className="btn-visible py-2 px-6 shadow-lg"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
