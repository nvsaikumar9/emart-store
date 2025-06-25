
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useVendor } from '@/hooks/useVendor';
import { vendorProfileSchema, type VendorProfileInput } from '@/utils/validation';
import { Save, Building, User, Phone, MapPin, Globe, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export const VendorProfile = () => {
  const { vendor, loading, createOrUpdateVendor } = useVendor();
  const [formData, setFormData] = useState<VendorProfileInput>({
    business_name: '',
    contact_person: '',
    phone: '',
    address: '',
    website: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (vendor) {
      console.log('Loading vendor data into form:', vendor);
      setFormData({
        business_name: vendor.business_name || '',
        contact_person: vendor.contact_person || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        website: vendor.website || '',
        description: vendor.description || ''
      });
    }
  }, [vendor]);

  const handleInputChange = (field: keyof VendorProfileInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = (): boolean => {
    try {
      vendorProfileSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const validationErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        const field = err.path[0];
        validationErrors[field] = err.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      console.log('Saving vendor profile:', formData);
      await createOrUpdateVendor(formData);
      setSuccessMessage('Profile saved successfully!');
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving vendor profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Business Profile</h2>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="gradient-primary hover:opacity-90 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>

      {errors.general && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">{errors.general}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader className="gradient-primary text-white">
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 mr-2" />
                Business Name *
              </label>
              <Input
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder="Enter your business name"
                className={`h-12 border-gray-200 focus:border-blue-500 ${errors.business_name ? 'border-red-500' : ''}`}
                maxLength={100}
              />
              {errors.business_name && (
                <p className="text-red-600 text-sm mt-1">{errors.business_name}</p>
              )}
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2" />
                Contact Person *
              </label>
              <Input
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                placeholder="Enter contact person name"
                className={`h-12 border-gray-200 focus:border-blue-500 ${errors.contact_person ? 'border-red-500' : ''}`}
                maxLength={100}
              />
              {errors.contact_person && (
                <p className="text-red-600 text-sm mt-1">{errors.contact_person}</p>
              )}
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className={`h-12 border-gray-200 focus:border-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                maxLength={15}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="Enter website URL"
                className={`h-12 border-gray-200 focus:border-blue-500 ${errors.website ? 'border-red-500' : ''}`}
              />
              {errors.website && (
                <p className="text-red-600 text-sm mt-1">{errors.website}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Business Address
            </label>
            <Textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your business address"
              rows={3}
              className={`border-gray-200 focus:border-blue-500 ${errors.address ? 'border-red-500' : ''}`}
              maxLength={500}
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Business Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your business and what you offer"
              rows={4}
              className={`border-gray-200 focus:border-blue-500 ${errors.description ? 'border-red-500' : ''}`}
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
