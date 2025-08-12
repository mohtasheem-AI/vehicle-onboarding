"use client";

import { useState } from 'react';
import { ArrowLeft, ArrowRight, DollarSign, Plus, Trash2, Info, Clock, AlertTriangle, Edit, Settings, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PricingContentProps {
  currentSubStep: string;
  onSubStepChange: (subStep: string) => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

interface PredefinedAddOn {
  id: string;
  name: string;
  category: string;
  defaultPrice?: string;
  defaultUnit?: 'per_day' | 'per_trip';
  icon: string;
}

interface ConfiguredAddOn {
  id: string;
  name: string;
  price: string;
  unit: 'per_day' | 'per_trip';
  quantity: string;
  description: string;
  enabled: boolean;
}

interface Penalty {
  id: string;
  type: 'late_return' | 'smoking' | 'pet_damage' | 'cleaning' | 'fuel' | 'mileage' | 'custom';
  name: string;
  amount: string;
  description: string;
}

export default function PricingContent({ currentSubStep, onSubStepChange, onPreviousStep, onNextStep }: PricingContentProps) {
  const [basePricing, setBasePricing] = useState({
    dailyRate: '',
    weeklyDiscount: '10',
    monthlyDiscount: '20',
    minimumTrip: '1',
    advanceNotice: '2'
  });

  const [configuredAddOns, setConfiguredAddOns] = useState<ConfiguredAddOn[]>([]);
  const [editingAddOn, setEditingAddOn] = useState<ConfiguredAddOn | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [penalties, setPenalties] = useState<Penalty[]>([]);

  const [newPenalty, setNewPenalty] = useState<Partial<Penalty>>({
    type: 'late_return',
    name: '',
    amount: '',
    description: ''
  });

  // Predefined add-ons list (50+ items)
  const predefinedAddOns: PredefinedAddOn[] = [
    // Child & Family
    { id: 'child_seat', name: 'Child Seat', category: 'Child & Family', defaultPrice: '100', defaultUnit: 'per_day', icon: '👶' },
    { id: 'booster_seat', name: 'Booster Seat', category: 'Child & Family', defaultPrice: '80', defaultUnit: 'per_day', icon: '🪑' },
    { id: 'baby_stroller', name: 'Baby Stroller', category: 'Child & Family', defaultPrice: '150', defaultUnit: 'per_day', icon: '🚼' },
    { id: 'car_seat_base', name: 'Car Seat Base', category: 'Child & Family', defaultPrice: '120', defaultUnit: 'per_day', icon: '🔧' },
    
    // Technology & Connectivity
    { id: 'wifi_hotspot', name: 'WiFi Hotspot', category: 'Technology', defaultPrice: '200', defaultUnit: 'per_day', icon: '📶' },
    { id: 'phone_charger', name: 'Phone Charger', category: 'Technology', defaultPrice: '50', defaultUnit: 'per_trip', icon: '🔌' },
    { id: 'tablet_mount', name: 'Tablet Mount', category: 'Technology', defaultPrice: '100', defaultUnit: 'per_trip', icon: '📱' },
    { id: 'dash_cam', name: 'Dash Camera', category: 'Technology', defaultPrice: '300', defaultUnit: 'per_day', icon: '📹' },
    { id: 'bluetooth_adapter', name: 'Bluetooth Adapter', category: 'Technology', defaultPrice: '80', defaultUnit: 'per_trip', icon: '🎵' },
    
    // Navigation & Safety
    { id: 'gps_device', name: 'GPS Navigation Device', category: 'Navigation', defaultPrice: '150', defaultUnit: 'per_day', icon: '🗺️' },
    { id: 'emergency_kit', name: 'Emergency Kit', category: 'Safety', defaultPrice: '100', defaultUnit: 'per_trip', icon: '🚨' },
    { id: 'first_aid_kit', name: 'First Aid Kit', category: 'Safety', defaultPrice: '80', defaultUnit: 'per_trip', icon: '🏥' },
    { id: 'fire_extinguisher', name: 'Fire Extinguisher', category: 'Safety', defaultPrice: '120', defaultUnit: 'per_trip', icon: '🧯' },
    
    // Comfort & Convenience
    { id: 'seat_cushions', name: 'Seat Cushions', category: 'Comfort', defaultPrice: '100', defaultUnit: 'per_trip', icon: '🪑' },
    { id: 'blankets', name: 'Travel Blankets', category: 'Comfort', defaultPrice: '80', defaultUnit: 'per_trip', icon: '🛏️' },
    { id: 'pillows', name: 'Travel Pillows', category: 'Comfort', defaultPrice: '60', defaultUnit: 'per_trip', icon: '🛌' },
    { id: 'sunshades', name: 'Window Sunshades', category: 'Comfort', defaultPrice: '70', defaultUnit: 'per_trip', icon: '☀️' },
    { id: 'air_freshener', name: 'Air Freshener', category: 'Comfort', defaultPrice: '30', defaultUnit: 'per_trip', icon: '🌸' },
    
    // Storage & Organization
    { id: 'roof_box', name: 'Roof Storage Box', category: 'Storage', defaultPrice: '400', defaultUnit: 'per_day', icon: '📦' },
    { id: 'cargo_net', name: 'Cargo Net', category: 'Storage', defaultPrice: '80', defaultUnit: 'per_trip', icon: '🕸️' },
    { id: 'trunk_organizer', name: 'Trunk Organizer', category: 'Storage', defaultPrice: '100', defaultUnit: 'per_trip', icon: '🗂️' },
    { id: 'seat_organizer', name: 'Seat Back Organizer', category: 'Storage', defaultPrice: '60', defaultUnit: 'per_trip', icon: '👜' },
    
    // Sports & Recreation
    { id: 'bike_rack', name: 'Bike Rack', category: 'Sports', defaultPrice: '300', defaultUnit: 'per_day', icon: '🚴' },
    { id: 'ski_rack', name: 'Ski Rack', category: 'Sports', defaultPrice: '250', defaultUnit: 'per_day', icon: '🎿' },
    { id: 'surfboard_rack', name: 'Surfboard Rack', category: 'Sports', defaultPrice: '200', defaultUnit: 'per_day', icon: '🏄' },
    { id: 'kayak_rack', name: 'Kayak Rack', category: 'Sports', defaultPrice: '350', defaultUnit: 'per_day', icon: '🛶' },
    
    // Camping & Outdoor
    { id: 'camping_tent', name: 'Camping Tent', category: 'Camping', defaultPrice: '500', defaultUnit: 'per_trip', icon: '⛺' },
    { id: 'sleeping_bags', name: 'Sleeping Bags', category: 'Camping', defaultPrice: '200', defaultUnit: 'per_trip', icon: '🛌' },
    { id: 'camping_chairs', name: 'Camping Chairs', category: 'Camping', defaultPrice: '150', defaultUnit: 'per_trip', icon: '🪑' },
    { id: 'cooler', name: 'Cooler Box', category: 'Camping', defaultPrice: '180', defaultUnit: 'per_trip', icon: '🧊' },
    { id: 'portable_grill', name: 'Portable Grill', category: 'Camping', defaultPrice: '300', defaultUnit: 'per_trip', icon: '🔥' },
    
    // Winter & Weather
    { id: 'snow_chains', name: 'Snow Chains', category: 'Winter', defaultPrice: '200', defaultUnit: 'per_trip', icon: '⛓️' },
    { id: 'ice_scraper', name: 'Ice Scraper', category: 'Winter', defaultPrice: '40', defaultUnit: 'per_trip', icon: '🧊' },
    { id: 'umbrella', name: 'Umbrella', category: 'Weather', defaultPrice: '50', defaultUnit: 'per_trip', icon: '☂️' },
    { id: 'rain_cover', name: 'Rain Cover', category: 'Weather', defaultPrice: '80', defaultUnit: 'per_trip', icon: '🌧️' },
    
    // Tools & Maintenance
    { id: 'jumper_cables', name: 'Jumper Cables', category: 'Tools', defaultPrice: '100', defaultUnit: 'per_trip', icon: '🔋' },
    { id: 'tire_pump', name: 'Tire Pump', category: 'Tools', defaultPrice: '80', defaultUnit: 'per_trip', icon: '⚡' },
    { id: 'tool_kit', name: 'Basic Tool Kit', category: 'Tools', defaultPrice: '120', defaultUnit: 'per_trip', icon: '🔧' },
    
    // Entertainment
    { id: 'portable_speaker', name: 'Portable Speaker', category: 'Entertainment', defaultPrice: '150', defaultUnit: 'per_trip', icon: '🔊' },
    { id: 'travel_games', name: 'Travel Games', category: 'Entertainment', defaultPrice: '80', defaultUnit: 'per_trip', icon: '🎲' },
    { id: 'books_magazines', name: 'Books & Magazines', category: 'Entertainment', defaultPrice: '50', defaultUnit: 'per_trip', icon: '📚' },
    
    // Business & Work
    { id: 'laptop_table', name: 'Laptop Table', category: 'Business', defaultPrice: '120', defaultUnit: 'per_trip', icon: '💻' },
    { id: 'power_inverter', name: 'Power Inverter', category: 'Business', defaultPrice: '200', defaultUnit: 'per_trip', icon: '🔌' },
    
    // Special Needs
    { id: 'wheelchair_ramp', name: 'Wheelchair Ramp', category: 'Accessibility', defaultPrice: '400', defaultUnit: 'per_trip', icon: '♿' },
    { id: 'mobility_aid', name: 'Mobility Aid Storage', category: 'Accessibility', defaultPrice: '150', defaultUnit: 'per_trip', icon: '🦽' },
    
    // Luxury & Premium
    { id: 'premium_mats', name: 'Premium Floor Mats', category: 'Luxury', defaultPrice: '100', defaultUnit: 'per_trip', icon: '✨' },
    { id: 'leather_cleaner', name: 'Leather Care Kit', category: 'Luxury', defaultPrice: '80', defaultUnit: 'per_trip', icon: '🧴' },
    { id: 'air_purifier', name: 'Air Purifier', category: 'Luxury', defaultPrice: '200', defaultUnit: 'per_day', icon: '🌬️' }
  ];

  const handleContinue = () => {
    if (currentSubStep === 'base') {
      onSubStepChange('addon');
    } else if (currentSubStep === 'addon') {
      onSubStepChange('penalties');
    } else {
      onNextStep();
    }
  };

  const handleBack = () => {
    if (currentSubStep === 'penalties') {
      onSubStepChange('addon');
    } else if (currentSubStep === 'addon') {
      onSubStepChange('base');
    } else {
      onPreviousStep();
    }
  };

  const handleAddOnToggle = (predefinedAddOn: PredefinedAddOn, enabled: boolean) => {
    if (enabled) {
      // Create new configured add-on and open config dialog
      const newConfiguredAddOn: ConfiguredAddOn = {
        id: predefinedAddOn.id,
        name: predefinedAddOn.name,
        price: predefinedAddOn.defaultPrice || '',
        unit: predefinedAddOn.defaultUnit || 'per_day',
        quantity: '1',
        description: '',
        enabled: false // Will be set to true only after saving
      };
      setEditingAddOn(newConfiguredAddOn);
      setShowConfigDialog(true);
      setHasUnsavedChanges(false);
    } else {
      // Disable the add-on but keep configuration
      setConfiguredAddOns(prev => 
        prev.map(addon => 
          addon.id === predefinedAddOn.id 
            ? { ...addon, enabled: false }
            : addon
        )
      );
    }
  };

  const handleEditAddOn = (configuredAddOn: ConfiguredAddOn) => {
    setEditingAddOn({ ...configuredAddOn });
    setShowConfigDialog(true);
    setHasUnsavedChanges(false);
  };

  const handleConfigChange = (field: keyof ConfiguredAddOn, value: string) => {
    if (editingAddOn) {
      setEditingAddOn(prev => prev ? { ...prev, [field]: value } : null);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveConfig = () => {
    if (!editingAddOn) return;

    const existingIndex = configuredAddOns.findIndex(addon => addon.id === editingAddOn.id);
    const savedAddOn = { ...editingAddOn, enabled: true };

    if (existingIndex >= 0) {
      // Update existing
      setConfiguredAddOns(prev => 
        prev.map((addon, index) => 
          index === existingIndex ? savedAddOn : addon
        )
      );
    } else {
      // Add new
      setConfiguredAddOns(prev => [...prev, savedAddOn]);
    }

    setShowConfigDialog(false);
    setEditingAddOn(null);
    setHasUnsavedChanges(false);
  };

  const handleCancelConfig = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
    } else {
      setShowConfigDialog(false);
      setEditingAddOn(null);
    }
  };

  const handleConfirmCancel = () => {
    // If this was a new add-on being configured, remove it completely
    const wasNewAddOn = !configuredAddOns.find(addon => addon.id === editingAddOn?.id);
    
    setShowConfigDialog(false);
    setShowCancelConfirm(false);
    setEditingAddOn(null);
    setHasUnsavedChanges(false);
  };

  const isAddOnConfigured = (addOnId: string) => {
    return configuredAddOns.find(addon => addon.id === addOnId);
  };

  const isAddOnEnabled = (addOnId: string) => {
    const configured = configuredAddOns.find(addon => addon.id === addOnId);
    return configured?.enabled || false;
  };

  const getConfiguredAddOn = (addOnId: string) => {
    return configuredAddOns.find(addon => addon.id === addOnId);
  };

  const isConfigValid = () => {
    if (!editingAddOn) return false;
    return editingAddOn.price && 
           parseFloat(editingAddOn.price) > 0 && 
           editingAddOn.quantity && 
           parseInt(editingAddOn.quantity) >= 1 &&
           editingAddOn.unit;
  };

  const addPenalty = () => {
    if (newPenalty.name && newPenalty.amount) {
      const penalty: Penalty = {
        id: Date.now().toString(),
        type: newPenalty.type || 'late_return',
        name: newPenalty.name,
        amount: newPenalty.amount,
        description: newPenalty.description || ''
      };
      setPenalties(prev => [...prev, penalty]);
      setNewPenalty({ type: 'late_return', name: '', amount: '', description: '' });
    }
  };

  const removePenalty = (id: string) => {
    setPenalties(prev => prev.filter(penalty => penalty.id !== id));
  };

  const getStepInfo = () => {
    if (currentSubStep === 'base') {
      return { title: '💰 Set your base pricing', step: '5 of 7' };
    } else if (currentSubStep === 'addon') {
      return { title: '➕ Add optional extras', step: '5 of 7' };
    } else {
      return { title: '⚠️ Set penalties and fees', step: '5 of 7' };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Set your pricing
        </h1>
        <p className="text-lg text-gray-700">
          {stepInfo.title}
        </p>
      </div>

      <div className="space-y-6">
        {currentSubStep === 'base' && (
          <>
            {/* Base Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Base Pricing
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Set your daily rate and discount structure for longer rentals.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyRate">Daily Rate (₹)</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      placeholder="2500"
                      value={basePricing.dailyRate}
                      onChange={(e) => setBasePricing(prev => ({ ...prev, dailyRate: e.target.value }))}
                      min="0"
                    />
                    <p className="text-xs text-gray-500">Base rate per day before any discounts</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumTrip">Minimum Trip Duration (days)</Label>
                    <Select 
                      value={basePricing.minimumTrip} 
                      onValueChange={(value) => setBasePricing(prev => ({ ...prev, minimumTrip: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="2">2 days</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weeklyDiscount">Weekly Discount (%)</Label>
                    <Input
                      id="weeklyDiscount"
                      type="number"
                      placeholder="10"
                      value={basePricing.weeklyDiscount}
                      onChange={(e) => setBasePricing(prev => ({ ...prev, weeklyDiscount: e.target.value }))}
                      min="0"
                      max="50"
                    />
                    <p className="text-xs text-gray-500">Discount for 7+ day rentals</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyDiscount">Monthly Discount (%)</Label>
                    <Input
                      id="monthlyDiscount"
                      type="number"
                      placeholder="20"
                      value={basePricing.monthlyDiscount}
                      onChange={(e) => setBasePricing(prev => ({ ...prev, monthlyDiscount: e.target.value }))}
                      min="0"
                      max="50"
                    />
                    <p className="text-xs text-gray-500">Discount for 30+ day rentals</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="advanceNotice">Advance Notice Required (hours)</Label>
                    <Select 
                      value={basePricing.advanceNotice} 
                      onValueChange={(value) => setBasePricing(prev => ({ ...prev, advanceNotice: value }))}
                    >
                      <SelectTrigger className="md:w-1/2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="12">12 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Minimum time between booking and pickup</p>
                  </div>
                </div>

                {/* Pricing Preview */}
                {basePricing.dailyRate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Pricing Preview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Daily Rate</p>
                        <p className="font-medium">₹{basePricing.dailyRate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Weekly Rate (7 days)</p>
                        <p className="font-medium">
                          ₹{Math.round(parseInt(basePricing.dailyRate) * 7 * (1 - parseInt(basePricing.weeklyDiscount) / 100))}
                          <span className="text-green-600 text-xs ml-1">
                            ({basePricing.weeklyDiscount}% off)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly Rate (30 days)</p>
                        <p className="font-medium">
                          ₹{Math.round(parseInt(basePricing.dailyRate) * 30 * (1 - parseInt(basePricing.monthlyDiscount) / 100))}
                          <span className="text-green-600 text-xs ml-1">
                            ({basePricing.monthlyDiscount}% off)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {currentSubStep === 'addon' && (
          <>
            {/* Add-ons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Optional Add-ons
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Enable and configure optional extras that renters can add to their booking for additional income.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Add-ons by Category */}
                <div className="space-y-4">
                  {Object.entries(
                    predefinedAddOns.reduce((acc, addon) => {
                      if (!acc[addon.category]) acc[addon.category] = [];
                      acc[addon.category].push(addon);
                      return acc;
                    }, {} as Record<string, PredefinedAddOn[]>)
                  ).map(([category, addons]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium text-gray-900 text-sm">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {addons.map((addon) => {
                          const configured = getConfiguredAddOn(addon.id);
                          const isEnabled = isAddOnEnabled(addon.id);
                          
                          return (
                            <div key={addon.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-lg">{addon.icon}</span>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{addon.name}</p>
                                    {configured && isEnabled && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        ₹{configured.price} {configured.unit.replace('_', ' ')} • Max {configured.quantity}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={(checked) => handleAddOnToggle(addon, checked)}
                                />
                              </div>
                              
                              {configured && isEnabled && (
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <span className="text-xs text-green-700 font-medium">Active</span>
                                  </div>
                                  <Button
                                    onClick={() => handleEditAddOn(configured)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 px-2"
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    <span className="text-xs">Edit</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Add-ons Summary */}
                {configuredAddOns.filter(addon => addon.enabled).length > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    <h4 className="font-medium text-gray-900">Active Add-ons Summary</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="space-y-2">
                        {configuredAddOns.filter(addon => addon.enabled).map((addon) => (
                          <div key={addon.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-green-900">{addon.name}</span>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                ₹{addon.price} {addon.unit.replace('_', ' ')}
                              </Badge>
                            </div>
                            <span className="text-xs text-green-700">Max {addon.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {configuredAddOns.filter(addon => addon.enabled).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No add-ons enabled yet</p>
                    <p className="text-sm">Toggle on any add-on above to configure and enable it for renters</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card>
              <CardContent className="pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Add-on Guidelines</p>
                      <ul className="text-xs space-y-1">
                        <li>• Only enabled add-ons will be shown to renters during booking</li>
                        <li>• Per-day add-ons are multiplied by the number of rental days</li>
                        <li>• Per-trip add-ons are charged once regardless of rental duration</li>
                        <li>• Set reasonable quantity limits based on your vehicle capacity</li>
                        <li>• Use descriptions to clarify what's included or any conditions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Add-on Configuration Dialog */}
        <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configure Add-on: {editingAddOn?.name}
              </DialogTitle>
              <DialogDescription>
                Set pricing, quantity limits, and description for this add-on.
              </DialogDescription>
            </DialogHeader>

            {editingAddOn && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="config-price">Price per unit (₹) *</Label>
                    <Input
                      id="config-price"
                      type="number"
                      placeholder="100"
                      value={editingAddOn.price}
                      onChange={(e) => handleConfigChange('price', e.target.value)}
                      min="1"
                      step="1"
                    />
                    {editingAddOn.price && parseFloat(editingAddOn.price) <= 0 && (
                      <p className="text-xs text-red-600">Price must be greater than 0</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="config-quantity">Maximum quantity *</Label>
                    <Input
                      id="config-quantity"
                      type="number"
                      placeholder="1"
                      value={editingAddOn.quantity}
                      onChange={(e) => handleConfigChange('quantity', e.target.value)}
                      min="1"
                      step="1"
                    />
                    {editingAddOn.quantity && parseInt(editingAddOn.quantity) < 1 && (
                      <p className="text-xs text-red-600">Quantity must be at least 1</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Pricing model *</Label>
                  <RadioGroup
                    value={editingAddOn.unit}
                    onValueChange={(value: 'per_day' | 'per_trip') => handleConfigChange('unit', value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="per_day" id="per_day" />
                      <Label htmlFor="per_day" className="cursor-pointer">
                        Per Day
                        <span className="block text-xs text-gray-500 mt-1">
                          Charged daily (Price × Quantity × Days)
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="per_trip" id="per_trip" />
                      <Label htmlFor="per_trip" className="cursor-pointer">
                        Per Trip
                        <span className="block text-xs text-gray-500 mt-1">
                          One-time charge (Price × Quantity)
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="config-description">Description (Optional)</Label>
                  <Textarea
                    id="config-description"
                    placeholder="Provide additional details about this add-on, what's included, or any special instructions..."
                    value={editingAddOn.description}
                    onChange={(e) => handleConfigChange('description', e.target.value)}
                    className="min-h-[80px] resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {editingAddOn.description.length}/500 characters
                  </div>
                </div>

                {/* Pricing Preview */}
                {editingAddOn.price && editingAddOn.quantity && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Pricing Examples</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        <strong>1 unit, 3-day trip:</strong> ₹{editingAddOn.price} × 1 × {editingAddOn.unit === 'per_day' ? '3' : '1'} = ₹{parseInt(editingAddOn.price) * 1 * (editingAddOn.unit === 'per_day' ? 3 : 1)}
                      </p>
                      <p>
                        <strong>2 units, 3-day trip:</strong> ₹{editingAddOn.price} × 2 × {editingAddOn.unit === 'per_day' ? '3' : '1'} = ₹{parseInt(editingAddOn.price) * 2 * (editingAddOn.unit === 'per_day' ? 3 : 1)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleCancelConfig}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveConfig}
                disabled={!isConfigValid()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save & Enable Add-on
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard Changes?</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Discarding will deactivate this add-on and lose your configuration.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
                Keep Editing
              </Button>
              <Button variant="destructive" onClick={handleConfirmCancel}>
                Discard & Deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {currentSubStep === 'penalties' && (
          <>
            {/* Penalties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Penalties & Fees
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Set penalties for policy violations to protect your vehicle and business.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Penalty */}
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-gray-900">Add New Penalty</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="penaltyType">Penalty Type</Label>
                      <Select 
                        value={newPenalty.type} 
                        onValueChange={(value: Penalty['type']) => setNewPenalty(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="late_return">Late Return</SelectItem>
                          <SelectItem value="smoking">Smoking</SelectItem>
                          <SelectItem value="pet_damage">Pet Damage</SelectItem>
                          <SelectItem value="cleaning">Extra Cleaning</SelectItem>
                          <SelectItem value="fuel">Fuel Policy Violation</SelectItem>
                          <SelectItem value="mileage">Excess Mileage</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="penaltyName">Penalty Name</Label>
                      <Input
                        id="penaltyName"
                        placeholder="e.g., Late return fee, Smoking penalty"
                        value={newPenalty.name}
                        onChange={(e) => setNewPenalty(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="penaltyAmount">Amount (₹)</Label>
                      <Input
                        id="penaltyAmount"
                        type="number"
                        placeholder="500"
                        value={newPenalty.amount}
                        onChange={(e) => setNewPenalty(prev => ({ ...prev, amount: e.target.value }))}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="penaltyDescription">Description</Label>
                      <Textarea
                        id="penaltyDescription"
                        placeholder="Describe when this penalty applies and any conditions"
                        value={newPenalty.description}
                        onChange={(e) => setNewPenalty(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[60px] resize-none"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={addPenalty}
                    disabled={!newPenalty.name || !newPenalty.amount}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Penalty
                  </Button>
                </div>

                {/* Current Penalties */}
                {penalties.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Your Penalties</h4>
                    <div className="space-y-2">
                      {penalties.map((penalty) => (
                        <div key={penalty.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-red-900">{penalty.name}</p>
                              <Badge variant="destructive" className="text-xs">
                                ₹{penalty.amount}
                              </Badge>
                            </div>
                            {penalty.description && (
                              <p className="text-sm text-red-700">{penalty.description}</p>
                            )}
                          </div>
                          <Button
                            onClick={() => removePenalty(penalty.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {penalties.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No penalties set</p>
                    <p className="text-sm">Add penalties to protect your vehicle and set clear expectations</p>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Penalty Guidelines</p>
                      <ul className="text-xs space-y-1">
                        <li>• Keep penalties reasonable and clearly communicated</li>
                        <li>• Document any violations with photos or evidence</li>
                        <li>• Be consistent in applying penalties across all rentals</li>
                        <li>• Consider local laws and regulations when setting amounts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}