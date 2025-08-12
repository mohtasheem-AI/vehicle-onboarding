"use client";

import { useState } from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function VehicleInfoContent() {
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');

  const minDescriptionLength = 50;
  const maxDescriptionLength = 1000;
  const isDescriptionValid = description.length >= minDescriptionLength;

  const addHighlight = () => {
    if (newHighlight.trim() && highlights.length < 5 && !highlights.includes(newHighlight.trim())) {
      setHighlights(prev => [...prev, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const removeHighlight = (highlight: string) => {
    setHighlights(prev => prev.filter(h => h !== highlight));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addHighlight();
    }
  };

  // Sample vehicle data for context
  const vehicleInfo = {
    make: "Volkswagen",
    model: "Jetta",
    year: 2024,
    licensePlate: "TTS8330"
  };

  const descriptionTips = [
    "Mention the vehicle's condition and maintenance history",
    "Highlight unique features or recent upgrades",
    "Include information about comfort and driving experience",
    "Note any special equipment or accessories",
    "Describe what makes your vehicle special for renters"
  ];

  return (
    <div className="space-y-6">
      {/* Vehicle Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Vehicle Description
            <Badge variant="secondary" className="text-xs">Required</Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Write a compelling description that helps renters understand what makes your vehicle special.
            Minimum {minDescriptionLength} characters required.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your vehicle's condition, features, and what makes it great for renters. For example: 'This well-maintained 2024 Volkswagen Jetta offers excellent fuel economy and a smooth, comfortable ride. Perfect for city driving and road trips, it features modern safety technology and a spacious interior...'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={maxDescriptionLength}
            />
            <div className="flex justify-between text-sm">
              <span className={`${isDescriptionValid ? 'text-green-600' : 'text-red-500'}`}>
                {isDescriptionValid ? '✓' : '⚠️'} {description.length}/{minDescriptionLength} minimum characters
              </span>
              <span className="text-gray-500">
                {description.length}/{maxDescriptionLength} max
              </span>
            </div>
          </div>

          {/* Description Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Writing Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {descriptionTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-blue-600">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Key Highlights
            <Badge variant="outline" className="text-xs">Optional</Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Add up to 5 key highlights that will be prominently displayed to renters.
            These should be your vehicle's best selling points.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="highlight">Add Highlight</Label>
            <div className="flex gap-2">
              <Textarea
                id="highlight"
                placeholder="e.g., 'Excellent fuel economy - 35+ MPG' or 'Recently serviced with new tires'"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-h-[40px] max-h-[80px] resize-none"
                maxLength={100}
              />
              <Button
                onClick={addHighlight}
                disabled={!newHighlight.trim() || highlights.length >= 5}
                size="sm"
                className="px-4"
              >
                Add
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              {highlights.length}/5 highlights • {newHighlight.length}/100 characters
            </div>
          </div>

          {highlights.length > 0 && (
            <div className="space-y-2">
              <Label>Current Highlights</Label>
              <div className="space-y-2">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm">{highlight}</span>
                    <Button
                      onClick={() => removeHighlight(highlight)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {highlights.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No highlights added yet</p>
              <p className="text-xs mt-1">Add highlights to make your listing stand out</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {(description || highlights.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Preview</CardTitle>
            <p className="text-sm text-gray-600">
              This is how your description will appear to renters
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </h3>
                {highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        ✨ {highlight}
                      </Badge>
                    ))}
                  </div>
                )}
                {description && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Message */}
    </div>
  );
}