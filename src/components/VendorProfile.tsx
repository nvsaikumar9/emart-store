
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from './AuthProvider';
import { Save, Building, User, Phone, MapPin, Globe, FileText } from 'lucide-react';

export const VendorProfile = () => {
  const { user, updateVendorDetails } = useAuth();
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    contactPerson: user?.contactPerson || '',
    phone: user?.phone || '',
    address: user?.address || '',
    website: user?.website || '',
    description: user?.description || ''
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateVendorDetails(formData);
      setSaving(false);
    }, 500);
  };

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
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
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
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
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
