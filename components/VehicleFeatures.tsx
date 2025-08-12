"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function VehicleFeatures() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);
  const [newCustomFeature, setNewCustomFeature] = useState('');

  // Predefined features grouped by category
  const predefinedFeatures = {
    "Driving & Safety": [
      { label: "All-wheel drive", value: "all_wheel_drive" },
      { label: "Blind spot warning", value: "blind_spot_warning" },
      { label: "Backup camera", value: "backup_camera" },
      { label: "Keyless entry", value: "keyless_entry" },
      { label: "Parking sensors", value: "parking_sensors" },
      { label: "Lane departure warning", value: "lane_departure_warning" },
      { label: "Collision warning system", value: "collision_warning" },
      { label: "Adaptive cruise control", value: "adaptive_cruise_control" },
      { label: "Anti-lock braking system (ABS)", value: "abs" }
    ],
    "Convenience & Connectivity": [
      { label: "USB charger", value: "usb_charger" },
      { label: "USB input", value: "usb_input" },
      { label: "AUX input", value: "aux_input" },
      { label: "Bluetooth", value: "bluetooth" },
      { label: "Android Auto", value: "android_auto" },
      { label: "Apple CarPlay", value: "apple_carplay" },
      { label: "GPS Navigation", value: "gps" },
      { label: "Remote start", value: "remote_start" },
      { label: "Power liftgate", value: "power_liftgate" },
      { label: "Hands-free trunk", value: "hands_free_trunk" }
    ],
    "Comfort": [
      { label: "Heated seats", value: "heated_seats" },
      { label: "Ventilated seats", value: "ventilated_seats" },
      { label: "Leather seats", value: "leather_seats" },
      { label: "Sunroof", value: "sunroof" },
      { label: "Climate control", value: "climate_control" },
      { label: "Heated steering wheel", value: "heated_steering_wheel" }
    ],
    "Travel & Utility": [
      { label: "Ski rack", value: "ski_rack" },
      { label: "Bike rack", value: "bike_rack" },
      { label: "Roof box", value: "roof_box" },
      { label: "Tow hitch", value: "tow_hitch" },
      { label: "Snow tires", value: "snow_tires" },
      { label: "Toll pass", value: "toll_pass" },
      { label: "Convertible", value: "convertible" }
    ],
    "Lifestyle": [
      { label: "Pet friendly", value: "pet_friendly" },
      { label: "Child seat", value: "child_seat" },
      { label: "Wheelchair accessible", value: "wheelchair_accessible" },
      { label: "Smoking allowed", value: "smoking_allowed" }
    ]
  };

  const handleFeatureToggle = (featureValue: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureValue) 
        ? prev.filter(f => f !== featureValue)
        : [...prev, featureValue]
    );
  };

  const addCustomFeature = () => {
    if (newCustomFeature.trim() && !customFeatures.includes(newCustomFeature.trim())) {
      setCustomFeatures(prev => [...prev, newCustomFeature.trim()]);
      setNewCustomFeature('');
    }
  };

  const removeCustomFeature = (feature: string) => {
    setCustomFeatures(prev => prev.filter(f => f !== feature));
  };

  const totalSelectedFeatures = selectedFeatures.length + customFeatures.length;
  const isMinimumMet = totalSelectedFeatures >= 2;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Feature Selection Progress</h3>
            <p className="text-sm text-blue-700 mt-1">
              Select at least 2 features to continue. Currently selected: {totalSelectedFeatures}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-900">
              {totalSelectedFeatures}/2 minimum
            </span>
            <div className={`h-2 w-16 bg-blue-200 rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${Math.min(100, (totalSelectedFeatures / 2) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Predefined Features */}
      {Object.entries(predefinedFeatures).map(([category, features]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg font-medium">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feature) => (
                <div key={feature.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature.value}
                    checked={selectedFeatures.includes(feature.value)}
                    onCheckedChange={() => handleFeatureToggle(feature.value)}
                  />
                  <label
                    htmlFor={feature.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Custom Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Custom Features</CardTitle>
          <p className="text-sm text-gray-600">Add any additional features not listed above</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter custom feature (min 1 character)"
              value={newCustomFeature}
              onChange={(e) => setNewCustomFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
            />
            <Button 
              onClick={addCustomFeature}
              disabled={!newCustomFeature.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {customFeatures.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Added Custom Features:</h4>
              <div className="flex flex-wrap gap-2">
                {customFeatures.map((feature) => (
                  <Badge key={feature} variant="secondary" className="flex items-center space-x-1">
                    <span>{feature}</span>
                    <button
                      onClick={() => removeCustomFeature(feature)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Features Summary */}
      {totalSelectedFeatures > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Selected Features Summary</CardTitle>
            <p className="text-sm text-gray-600">These features will be shown to renters</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedFeatures.map((featureValue) => {
                const feature = Object.values(predefinedFeatures)
                  .flat()
                  .find(f => f.value === featureValue);
                return feature ? (
                  <Badge key={featureValue} variant="outline">
                    {feature.label}
                  </Badge>
                ) : null;
              })}
              {customFeatures.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature} (Custom)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isMinimumMet && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            ⚠️ Please select at least {2 - totalSelectedFeatures} more feature(s) to continue to the next step.
          </p>
        </div>
      )}
    </div>
  );
}