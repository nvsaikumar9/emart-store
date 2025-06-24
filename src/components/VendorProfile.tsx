
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useVendor } from '@/hooks/useVendor';
import { Save, Building, User, Phone, MapPin, Globe, FileText } from 'lucide-react';

export const VendorProfile = () => {
  const { vendor, loading, createOrUpdateVendor } = useVendor();
  const [formData, setFormData] = useState({
    business_name: '',
    contact_person: '',
    phone: '',
    address: '',
    website: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vendor) {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await createOrUpdateVendor(formData);
    } catch (error) {
      console.error('Error saving vendor profile:', error);
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
                Business Name
              </label>
              <Input
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder="Enter your business name"
                className="h-12 border-gray-200 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2" />
                Contact Person
              </label>
              <Input
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                placeholder="Enter contact person name"
                className="h-12 border-gray-200 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className="h-12 border-gray-200 focus:border-blue-500"
              />
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
                className="h-12 border-gray-200 focus:border-blue-500"
              />
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
              className="border-gray-200 focus:border-blue-500"
            />
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
              className="border-gray-200 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
