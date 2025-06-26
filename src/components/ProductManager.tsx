import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProductViewer3D } from './ProductViewer3D';
import { useProducts, Product } from '@/hooks/useProducts';
import { Plus, Upload, Trash2, Eye, Package, DollarSign, FileText, CheckCircle, XCircle, Copy, Hash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const ProductManager = () => {
  const { products, loading, saveProduct, deleteProduct, publishProduct, unpublishProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreateProduct = () => {
    const newProduct: Partial<Product> = {
      name: '',
      description: '',
      price: 0,
      images: [],
      status: 'draft'
    };
    setEditingProduct(newProduct);
    setShowPreview(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    setSaving(true);
    try {
      await saveProduct(editingProduct);
      toast({
        title: "Success!",
        description: "Product has been successfully added to the product management screen.",
      });
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublishProduct = async (id: string) => {
    try {
      await publishProduct(id);
      toast({
        title: "Product Published",
        description: "Product is now visible in the storefront.",
      });
    } catch (error) {
      console.error('Error publishing product:', error);
    }
  };

  const handleUnpublishProduct = async (id: string) => {
    try {
      await unpublishProduct(id);
      toast({
        title: "Product Unpublished",
        description: "Product has been removed from the storefront.",
      });
    } catch (error) {
      console.error('Error unpublishing product:', error);
    }
  };

  const copyProductId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copied!",
      description: "Product ID copied to clipboard.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editingProduct) return;

    const imageUrls = files.map((file) => {
      return URL.createObjectURL(file);
    });
    
    setEditingProduct({
      ...editingProduct,
      images: [...(editingProduct.images || []), ...imageUrls].slice(0, 150)
    });
  };

  const removeImage = (index: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      images: editingProduct.images?.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (editingProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">
            {editingProduct.id ? 'Edit Product' : 'Create Product'}
          </h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="btn-outline-visible"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button 
              onClick={handleSaveProduct}
              disabled={saving}
              className="btn-visible"
            >
              {saving ? 'Saving...' : 'Save Product'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditingProduct(null)}
              className="btn-outline-visible"
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Show Product ID if editing existing product */}
        {editingProduct.id && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Product ID:</span>
                  <span className="text-sm font-mono text-blue-900">{editingProduct.id}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyProductId(editingProduct.id!)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gradient-card shadow-lg">
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
                  value={editingProduct.name || ''}
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
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  placeholder="Enter product description"
                  rows={4}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price (₹)
                </label>
                <Input
                  type="number"
                  value={editingProduct.price || 0}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  step="0.01"
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Product Images ({(editingProduct.images || []).length}/150)
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
                    className="w-full h-12 border-dashed border-2 btn-outline-visible"
                    disabled={(editingProduct.images || []).length >= 150}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Images (Max 150)
                  </Button>
                  
                  {editingProduct.images && editingProduct.images.length > 0 && (
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
            <Card className="gradient-card shadow-lg">
              <CardHeader className="gradient-secondary text-white">
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  3D Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ProductViewer3D
                  images={editingProduct.images || []}
                  productName={editingProduct.name || 'Product Preview'}
                />
                <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-xl text-gray-800">{editingProduct.name || 'Product Name'}</h3>
                  <p className="text-gray-600 text-sm">{editingProduct.description || 'Product description will appear here...'}</p>
                  <div className="price-text text-xl font-bold">
                    ₹{(editingProduct.price || 0).toFixed(2)}
                  </div>
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
          className="btn-visible"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="gradient-card shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg mb-4 overflow-hidden">
                <ProductViewer3D
                  images={product.images}
                  productName={product.name}
                  className="w-full h-full rounded-none"
                />
              </div>
              <div className="p-4">
                {/* Product ID Display */}
                <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-1">
                    <Hash className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600 font-mono">{product.id.slice(0, 8)}...</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyProductId(product.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="price-text text-lg font-bold mb-4">
                  ₹{product.price.toFixed(2)}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status}
                  </span>
                  {product.status === 'published' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnpublishProduct(product.id)}
                      className="btn-outline-visible text-xs"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handlePublishProduct(product.id)}
                      className="btn-visible text-xs"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                  )}
                </div>
                
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                    className="btn-outline-visible text-xs"
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
