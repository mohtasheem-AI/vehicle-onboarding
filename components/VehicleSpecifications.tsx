"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function VehicleSpecifications() {
  const [vehicleData, setVehicleData] = useState({
    vin: "3VWBM7BU6RM018774",
    make: "Volkswagen",
    model: "Jetta",
    year: "2024",
    trim: "",
    licensePlate: "TTS8330",
    seats: "5",
    doors: "4",
    transmission: "AUTOMATIC",
    fuelType: "Gasoline",
    drivetrain: "FWD",
    fuelTankSize: "",
    bootSpaceLiters: "",
    towingCapacityLbs: "",
    zeroToSixty: "",
    topSpeed: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Identity Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Basic Identity Specs</CardTitle>
          <p className="text-sm text-gray-600">These fields are typically fetched via VIN and optionally editable</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              value={vehicleData.vin}
              onChange={(e) => handleInputChange('vin', e.target.value)}
              className="bg-gray-50"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={vehicleData.make}
              onChange={(e) => handleInputChange('make', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={vehicleData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              value={vehicleData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trim">Trim (Optional)</Label>
            <Input
              id="trim"
              value={vehicleData.trim}
              onChange={(e) => handleInputChange('trim', e.target.value)}
              placeholder="e.g., SE, Limited, Sport"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input
              id="licensePlate"
              value={vehicleData.licensePlate}
              onChange={(e) => handleInputChange('licensePlate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Core Technical Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Core Technical Specs</CardTitle>
          <p className="text-sm text-gray-600">Key specifications for renters to understand vehicle capabilities</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select value={vehicleData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasoline">Gasoline</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transmission">Transmission</Label>
            <Select value={vehicleData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doors">Number of Doors</Label>
            <Select value={vehicleData.doors} onValueChange={(value) => handleInputChange('doors', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="drivetrain">Drive Type</Label>
            <Select value={vehicleData.drivetrain} onValueChange={(value) => handleInputChange('drivetrain', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FWD">Front-Wheel Drive (FWD)</SelectItem>
                <SelectItem value="RWD">Rear-Wheel Drive (RWD)</SelectItem>
                <SelectItem value="AWD">All-Wheel Drive (AWD)</SelectItem>
                <SelectItem value="4WD">Four-Wheel Drive (4WD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Capacity and Dimension Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Capacity and Dimension Specs</CardTitle>
          <p className="text-sm text-gray-600">Help renters plan for passengers and luggage</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seats">Seating Capacity</Label>
            <Select value={vehicleData.seats} onValueChange={(value) => handleInputChange('seats', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 seats</SelectItem>
                <SelectItem value="4">4 seats</SelectItem>
                <SelectItem value="5">5 seats</SelectItem>
                <SelectItem value="7">7 seats</SelectItem>
                <SelectItem value="8">8 seats</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelTankSize">Fuel Tank Size (L)</Label>
            <Input
              id="fuelTankSize"
              type="number"
              value={vehicleData.fuelTankSize}
              onChange={(e) => handleInputChange('fuelTankSize', e.target.value)}
              placeholder="e.g., 50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bootSpaceLiters">Boot/Cargo Space (L)</Label>
            <Input
              id="bootSpaceLiters"
              type="number"
              value={vehicleData.bootSpaceLiters}
              onChange={(e) => handleInputChange('bootSpaceLiters', e.target.value)}
              placeholder="e.g., 400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Performance Metrics (Optional)</CardTitle>
          <p className="text-sm text-gray-600">Display performance details for renters to understand vehicle power</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zeroToSixty">0-60 mph time (seconds)</Label>
            <Input
              id="zeroToSixty"
              type="number"
              step="0.1"
              value={vehicleData.zeroToSixty}
              onChange={(e) => handleInputChange('zeroToSixty', e.target.value)}
              placeholder="e.g., 8.5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topSpeed">Top Speed (mph)</Label>
            <Input
              id="topSpeed"
              type="number"
              value={vehicleData.topSpeed}
              onChange={(e) => handleInputChange('topSpeed', e.target.value)}
              placeholder="e.g., 130"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="towingCapacityLbs">Towing Capacity (lbs)</Label>
            <Input
              id="towingCapacityLbs"
              type="number"
              value={vehicleData.towingCapacityLbs}
              onChange={(e) => handleInputChange('towingCapacityLbs', e.target.value)}
              placeholder="e.g., 2000"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}