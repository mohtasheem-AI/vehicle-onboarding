"use client";

import { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Plus, Edit, Trash2, Search, Home, Plane, Building, Clock, Key, Info, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LocationContentProps {
  onPreviousStep: () => void;
  onNextStep: () => void;
}

interface Location {
  id: string;
  name: string;
  type: 'base' | 'additional';
  fee: string;
  keyHandover: 'in_person' | 'lockbox' | 'remote_unlock' | 'other';
  instructions: string;
  source: 'google' | 'suggested';
  enabled: boolean;
}

export function LocationContent({ onPreviousStep, onNextStep }: LocationContentProps) {
  const [baseLocation, setBaseLocation] = useState<Location | null>(null);
  const [additionalLocations, setAdditionalLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Mock suggested locations from previous listings
  const suggestedLocations = [
    { name: 'IGI Airport Terminal 3', fee: '500', type: 'airport', keyHandover: 'lockbox', instructions: 'Lockbox located at parking level P2, bay A-15. Code will be shared 1 hour before pickup.', source: 'suggested' },
    { name: 'IGI Airport Terminal 1', fee: '450', type: 'airport', keyHandover: 'in_person', instructions: 'Meet at Arrival Gate 2, near Costa Coffee. Call when you arrive.', source: 'suggested' },
    { name: 'Connaught Place Metro Station', fee: '200', type: 'metro', keyHandover: 'in_person', instructions: 'Meet at Gate 3 exit, near the taxi stand.', source: 'suggested' },
    { name: 'Select City Walk Mall', fee: '150', type: 'mall', keyHandover: 'lockbox', instructions: 'Parking level B1, lockbox near elevator 2.', source: 'suggested' },
    { name: 'Gurgaon Cyber Hub', fee: '300', type: 'business', keyHandover: 'remote_unlock', instructions: 'Vehicle parked in designated spot C-45. Use app to unlock.', source: 'suggested' },
    { name: 'New Delhi Railway Station', fee: '250', type: 'station', keyHandover: 'in_person', instructions: 'Meet at main entrance, near the information desk.', source: 'suggested' },
    { name: 'Khan Market', fee: '100', type: 'market', keyHandover: 'other', instructions: 'Keys with shopkeeper at Khan Market Cafe, mention booking ID.', source: 'suggested' },
    { name: 'DLF Mall of India', fee: '180', type: 'mall', keyHandover: 'lockbox', instructions: 'Ground floor parking, lockbox near security desk.', source: 'suggested' },
    { name: 'Karol Bagh Metro Station', fee: '150', type: 'metro', keyHandover: 'in_person', instructions: 'Exit 2, near the auto-rickshaw stand.', source: 'suggested' },
    { name: 'India Gate', fee: '120', type: 'landmark', keyHandover: 'in_person', instructions: 'Meet at the main parking area, near the ice cream vendors.', source: 'suggested' },
    { name: 'Nehru Place Metro Station', fee: '180', type: 'metro', keyHandover: 'lockbox', instructions: 'Exit 3, lockbox in parking area near gate.', source: 'suggested' },
    { name: 'Saket Select City Walk', fee: '200', type: 'mall', keyHandover: 'remote_unlock', instructions: 'Level 2 parking, spot S-23. Remote unlock available via app.', source: 'suggested' }
  ];

  // Mock Google Places search results
  const searchResults = searchQuery.length >= 3 ? [
    { name: 'Indira Gandhi International Airport', type: 'airport' },
    { name: 'New Delhi Railway Station', type: 'station' },
    { name: 'India Gate', type: 'landmark' },
    { name: 'Khan Market', type: 'market' },
  ].filter(result => 
    result.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleAddBaseLocation = (locationName: string) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: locationName,
      type: 'base',
      fee: '0',
      keyHandover: 'in_person',
      instructions: '',
      source: 'google',
      enabled: true
    };
    setBaseLocation(newLocation);
    setEditingLocation(newLocation);
    setShowLocationDialog(true);
    setSearchQuery('');
  };

  const handleAddAdditionalLocation = (locationName: string, source: 'google' | 'suggested' = 'google') => {

    const suggestedData = suggestedLocations.find(s => s.name === locationName);
    const newLocation: Location = {
      id: Date.now().toString() + Math.random(),
      name: locationName,
      type: 'additional',
      fee: suggestedData?.fee || '0',
      keyHandover: (suggestedData?.keyHandover as any) || 'in_person',
      instructions: suggestedData?.instructions || '',
      source,
      enabled: true
    };
    setEditingLocation(newLocation);
    setShowLocationDialog(true);
    setSearchQuery('');
  };

  const handleAddSuggestedLocation = (locationName: string, asBase: boolean = false) => {
    const suggestedData = suggestedLocations.find(s => s.name === locationName);
    const newLocation: Location = {
      id: Date.now().toString() + Math.random(),
      name: locationName,
      type: asBase ? 'base' : 'additional',
      fee: asBase ? '0' : (suggestedData?.fee || '0'),
      keyHandover: (suggestedData?.keyHandover as any) || 'in_person',
      instructions: suggestedData?.instructions || '',
      source: 'suggested' as 'google' | 'suggested',
      enabled: true
    };
    setEditingLocation(newLocation);
    setShowLocationDialog(true);
    setSearchQuery('');
  };

  const handleSaveLocation = () => {
    if (!editingLocation) return;

    if (editingLocation.type === 'base') {
      setBaseLocation(editingLocation);
    } else {
      if (editingLocation.id && additionalLocations.find(l => l.id === editingLocation.id)) {
        // Update existing
        setAdditionalLocations(prev => 
          prev.map(l => l.id === editingLocation.id ? editingLocation : l)
        );
      } else {
        // Add new
        setAdditionalLocations(prev => [...prev, editingLocation]);
      }
    }

    setShowLocationDialog(false);
    setEditingLocation(null);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation({ ...location });
    setShowLocationDialog(true);
  };

  const handleRemoveLocation = (id: string) => {
    setAdditionalLocations(prev => prev.filter(l => l.id !== id));
  };

  const handleLocationChange = (field: keyof Location, value: string) => {
    if (editingLocation) {
      setEditingLocation(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const getKeyHandoverLabel = (method: string) => {
    switch (method) {
      case 'in_person': return 'In Person';
      case 'lockbox': return 'Lockbox';
      case 'remote_unlock': return 'Remote Unlock';
      case 'other': return 'Other';
      default: return method;
    }
  };

  const getLocationIcon = (name: string) => {
    if (name.toLowerCase().includes('airport')) return <Plane className="h-4 w-4" />;
    if (name.toLowerCase().includes('metro') || name.toLowerCase().includes('station')) return <Building className="h-4 w-4" />;
    if (name.toLowerCase().includes('mall') || name.toLowerCase().includes('market')) return <Building className="h-4 w-4" />;
    return <MapPin className="h-4 w-4" />;
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Set pickup and drop-off locations
        </h1>
        <p className="text-lg text-gray-700">
          📍 Define where renters can collect and return your vehicle
        </p>
      </div>

      <div className="space-y-6">
        {/* Base Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Base Location
              <Badge variant="secondary" className="text-xs">Required • Free</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              This is where your vehicle is usually parked. Always free for pickup and drop-off.
            </p>
          </CardHeader>
          <CardContent>
            {!baseLocation ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-search">Search for your base location</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="base-search"
                      placeholder="Start typing your address (min 3 characters)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddBaseLocation(result.name)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                      >
                        {getLocationIcon(result.name)}
                        <span className="text-sm">{result.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.length > 0 && searchQuery.length < 3 && (
                  <p className="text-sm text-gray-500">Type at least 3 characters to search...</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{baseLocation.name}</p>
                    <p className="text-sm text-blue-700">
                      {getKeyHandoverLabel(baseLocation.keyHandover)} • Free
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditLocation(baseLocation)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBaseLocation(null)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Locations */}
        {suggestedLocations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Suggested Locations
                <Badge variant="outline" className="text-xs">From Other Vehicles</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                {!baseLocation 
                  ? "Select a base location or add additional locations from your other vehicle listings."
                  : "Add additional locations from your other vehicle listings to save time and maintain consistency."
                }
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestedLocations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {getLocationIcon(location.name)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{location.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            ₹{location.fee}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getKeyHandoverLabel(location.keyHandover)}
                          </Badge>
                        </div>
                        {location.source === 'suggested' && (
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                              Suggested
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!baseLocation && (
                        <Button
                          onClick={() => handleAddSuggestedLocation(location.name, true)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Home className="h-4 w-4 mr-1" />
                          Set as Base
                        </Button>
                      )}
                      <Button
                        onClick={() => handleAddSuggestedLocation(location.name, false)}
                        variant="outline"
                        size="sm"
                        className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why use suggested locations?</p>
                    <ul className="text-xs space-y-1">
                      <li>• Save time by reusing proven locations</li>
                      <li>• Maintain consistent pricing across your vehicles</li>
                      <li>• Leverage locations that renters already know</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Additional Pickup/Drop-off Locations
              <Badge variant="outline" className="text-xs">Optional</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Add convenient locations like airports, metro stations, or malls. Set custom fees for each.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Location Search */}
            <div className="space-y-2">
              <Label htmlFor="additional-search">Add new location</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="additional-search"
                  placeholder="Search for airports, metro stations, malls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddAdditionalLocation(result.name)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                    >
                      {getLocationIcon(result.name)}
                      <span className="text-sm">{result.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length > 0 && searchQuery.length < 3 && (
                <p className="text-sm text-gray-500">Type at least 3 characters to search...</p>
              )}
            </div>

            {/* Add Location Search */}
            {baseLocation && (
              <div className="space-y-2">
                <Label htmlFor="additional-search">Add new location</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="additional-search"
                    placeholder="Search for airports, metro stations, malls..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddAdditionalLocation(result.name)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                      >
                        {getLocationIcon(result.name)}
                        <span className="text-sm">{result.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Additional Locations List */}
            {additionalLocations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Your Additional Locations</h4>
                <div className="space-y-2">
                  {additionalLocations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getLocationIcon(location.name)}
                        <div>
                          <p className="font-medium text-gray-900">{location.name}</p>
                          <p className="text-sm text-gray-600">
                            ₹{location.fee} • {getKeyHandoverLabel(location.keyHandover)}
                            {location.source === 'suggested' && (
                              <Badge variant="outline" className="ml-2 text-xs">Suggested</Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditLocation(location)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLocation(location.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for Additional Locations */}
            {additionalLocations.length === 0 && baseLocation && (
              <div className="text-center py-6 text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium mb-1">No additional locations added</p>
                <p className="text-xs">Add convenient pickup/drop-off locations to attract more renters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Summary */}
        {(baseLocation || additionalLocations.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Location Summary</CardTitle>
              <p className="text-sm text-gray-600">
                This is how your locations will appear to renters
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                {baseLocation && (
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <Home className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{baseLocation.name}</p>
                        <Badge className="bg-blue-600 text-white text-xs">Base Location</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {getKeyHandoverLabel(baseLocation.keyHandover)} • Free
                      </p>
                      {baseLocation.instructions && (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {baseLocation.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {additionalLocations.map((location) => (
                  <div key={location.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    {getLocationIcon(location.name)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{location.name}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {getKeyHandoverLabel(location.keyHandover)} • ₹{location.fee} fee
                      </p>
                      {location.instructions && (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {location.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Location Configuration Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLocation?.type === 'base' ? 'Configure Base Location' : 'Configure Additional Location'}
            </DialogTitle>
            <DialogDescription>
              Set up key handover method and pricing for this location.
            </DialogDescription>
          </DialogHeader>

          {editingLocation && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getLocationIcon(editingLocation.name)}
                <div>
                  <p className="font-medium text-gray-900">{editingLocation.name}</p>
                  <p className="text-sm text-gray-600">
                    {editingLocation.type === 'base' ? 'Base Location' : 'Additional Location'}
                  </p>
                </div>
              </div>

              {editingLocation.type === 'additional' && (
                <div className="space-y-2">
                  <Label htmlFor="fee">Fee (₹)</Label>
                  <Input
                    id="fee"
                    type="number"
                    placeholder="0"
                    value={editingLocation.fee}
                    onChange={(e) => handleLocationChange('fee', e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Set to ₹0 for free pickup/drop-off at this location
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Label>Key Handover Method</Label>
                <RadioGroup
                  value={editingLocation.keyHandover}
                  onValueChange={(value) => handleLocationChange('keyHandover', value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in_person" id="in_person" />
                    <Label htmlFor="in_person" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      In Person - Meet the renter directly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lockbox" id="lockbox" />
                    <Label htmlFor="lockbox" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Lockbox - Keys stored in a secure lockbox
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remote_unlock" id="remote_unlock" />
                    <Label htmlFor="remote_unlock" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Remote Unlock - Digital/app-based access
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Other - Custom arrangement
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Handover Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Provide specific instructions for key handover at this location. For example: 'Meet at the main entrance', 'Lockbox code will be shared 1 hour before pickup', etc."
                  value={editingLocation.instructions}
                  onChange={(e) => handleLocationChange('instructions', e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={5000}
                />
                <div className="text-xs text-gray-500 text-right">
                  {editingLocation.instructions.length}/5000 characters
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLocationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLocation} className="bg-blue-600 hover:bg-blue-700">
              Save Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}