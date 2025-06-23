
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProductViewer3D } from './ProductViewer3D';
import { Plus, Upload, Trash2, Eye, Package, DollarSign, FileText } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: 'draft' | 'published';
}

export const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Sample Product',
      description: 'This is a sample product with 360° view',
      price: 99.99,
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      status: 'published'
    }
  ]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCreateProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      images: [],
      status: 'draft'
    };
    setEditingProduct(newProduct);
    setShowPreview(true);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    if (editingProduct.id && products.find(p => p.id === editingProduct.id)) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    } else {
      setProducts(prev => [...prev, { ...editingProduct, id: Date.now().toString() }]);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editingProduct) return;

    // Simulate image upload - in real app, upload to storage service
    const imageUrls = files.map((file, index) => {
      // Create object URL for preview
      return URL.createObjectURL(file);
    });
    
    setEditingProduct({
      ...editingProduct,
      images: [...editingProduct.images, ...imageUrls].slice(0, 150) // Limit to 150 images
    });
  };

  const removeImage = (index: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      images: editingProduct.images.filter((_, i) => i !== index)
    });
  };

  if (editingProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">
            {editingProduct.id && products.find(p => p.id === editingProduct.id) ? 'Edit Product' : 'Create Product'}
          </h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button 
              onClick={handleSaveProduct}
              className="gradient-primary hover:opacity-90 text-white"
            >
              Save Product
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditingProduct(null)}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gradient-card border-0 shadow-lg">
            <CardHeader className="gradient-primary text-white">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4 mr-2" />
                  Product Name
                </label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  placeholder="Enter product name"
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 mr-2" />
                  Description
                </label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  placeholder="Enter product description"
                  rows={4}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price ($)
                </label>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  step="0.01"
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Product Images ({editingProduct.images.length}/150)
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="w-full h-12 border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                    disabled={editingProduct.images.length >= 150}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Images (Max 150)
                  </Button>
                  
                  {editingProduct.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4 max-h-60 overflow-y-auto">
                      {editingProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {showPreview && (
            <Card className="gradient-card border-0 shadow-lg">
              <CardHeader className="gradient-secondary text-white">
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  3D Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ProductViewer3D
                  images={editingProduct.images}
                  productName={editingProduct.name || 'Product Preview'}
                />
                <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-xl text-gray-800">{editingProduct.name || 'Product Name'}</h3>
                  <p className="text-gray-600 text-sm">{editingProduct.description || 'Product description will appear here...'}</p>
                  <p className="text-3xl font-bold gradient-secondary bg-clip-text text-transparent">
                    ${editingProduct.price.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <Button 
          onClick={handleCreateProduct}
          className="gradient-primary hover:opacity-90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="gradient-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg mb-4 overflow-hidden">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="h-16 w-16" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <p className="text-2xl font-bold gradient-secondary bg-clip-text text-transparent mb-4">
                  ${product.price.toFixed(2)}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status}
                  </span>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProduct(product)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
