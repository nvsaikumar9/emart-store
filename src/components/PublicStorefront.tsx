
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductViewer3D } from './ProductViewer3D';
import { ImagePreloader } from './ImagePreloader';
import { useProducts, Product } from '@/hooks/useProducts';
import { useVendor } from '@/hooks/useVendor';
import { Eye, Phone, MapPin, Globe, User, Building, Hash, Copy, ShoppingCart, Search, Filter, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const PublicStorefront = () => {
  const { products, loading } = useProducts(true);
  const { vendor } = useVendor();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products based on search and price range
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesMinPrice = minPrice === '' || product.price >= minPrice;
    const matchesMaxPrice = maxPrice === '' || product.price <= maxPrice;
    
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
  };
  
  // Collect all images for preloading
  const allImages = React.useMemo(() => {
    return products.flatMap(product => product.images).filter(Boolean);
  }, [products]);

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

  const copyProductId = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Product code copied to clipboard.",
    });
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
        {/* Preload images for instant display */}
        <ImagePreloader images={selectedProduct.images} priority={true} />
        
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
                  {/* Product Code Display */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Hash className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Product Code:</span>
                          <span className="text-sm font-mono text-blue-900">{selectedProduct.product_code}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyProductId(selectedProduct.product_code)}
                          className="text-blue-600 border-blue-300 hover:bg-blue-100"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-800">{selectedProduct.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="price-text text-2xl font-black">
                        ₹{selectedProduct.price.toLocaleString('en-IN')}
                      </div>
                      {selectedProduct.minimum_lot && selectedProduct.minimum_lot > 1 && (
                        <div className="flex items-center text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Minimum Order: {selectedProduct.minimum_lot} units
                        </div>
                      )}
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
      {/* Preload all product images for instant display */}
      <ImagePreloader images={allImages} priority={true} />
      
      <div className="text-center py-20 gradient-primary text-white rounded-3xl shadow-2xl">
        <h1 className="text-6xl font-black mb-6">
          GTRADERS COLLECTION
        </h1>
        <p className="text-2xl max-w-3xl mx-auto opacity-95 leading-relaxed">
          Explore our unique collections. Shop the Latest from GTraders.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-600 mb-4">No Products Available</h2>
          <p className="text-xl text-gray-500">Products will appear here once vendors publish them.</p>
        </div>
      ) : (
        <>
          {/* Search and Filter Section */}
          <Card className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Toggle and Price Range */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-outline-visible"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Price Filter
                </Button>

                {showFilters && (
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Min Price:</label>
                      <Input
                        type="number"
                        placeholder="₹0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Max Price:</label>
                      <Input
                        type="number"
                        placeholder="₹∞"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {filteredProducts.length} of {products.length} products
                </span>
                {(searchQuery || minPrice !== '' || maxPrice !== '') && (
                  <span className="text-blue-600">Filters applied</span>
                )}
              </div>
            </div>
          </Card>

          {/* No Results Message */}
          {filteredProducts.length === 0 && products.length > 0 && (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p>Try changing your search or filter criteria.</p>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((product, index) => {
            const cardClass = index === 0 ? 'card-smartphone' : index === 1 ? 'card-laptop' : 'card-headphones';
            return (
              <Card key={product.id} className={`${cardClass} shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group`}>
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl overflow-hidden relative">
                    <ProductViewer3D
                      images={product.images}
                      productName={product.name}
                      className="w-full h-full rounded-none"
                    />
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
                    {/* Product Code Display */}
                    <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-1">
                        <Hash className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600 font-mono">{product.product_code}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyProductId(product.product_code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                     <h3 className="font-black text-2xl mb-4 text-gray-800">{product.name}</h3>
                     <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                     
                     {/* Minimum Lot (if applicable) */}
                     <div className="space-y-3 mb-6">
                       {product.minimum_lot && product.minimum_lot > 1 && (
                         <div className="flex items-center text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                           <ShoppingCart className="h-4 w-4 mr-1" />
                           Minimum Order: {product.minimum_lot} units
                         </div>
                       )}
                     </div>
                     
                     {/* Price and Button Side by Side */}
                     <div className="flex items-center justify-between gap-4 flex-wrap">
                       <div className="price-text text-xl sm:text-2xl font-black flex-shrink-0">
                         ₹{product.price.toLocaleString('en-IN')}
                       </div>
                       <Button
                         onClick={() => setSelectedProduct(product)}
                         className="btn-visible py-2 px-4 shadow-lg flex-shrink-0"
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
       </>
       )}
     </div>
   );
 };
