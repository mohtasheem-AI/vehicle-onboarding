"use client";

import { useState, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Upload, X, GripVertical, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PhotosContentProps {
  onPreviousStep: () => void;
  onNextStep: () => void;
}

interface Photo {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
}

export function PhotosContent({ onPreviousStep, onNextStep }: PhotosContentProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_PHOTOS = 20;
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return `${file.name}: Photo must be JPG, PNG, or WebP format.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: Photo must be less than 25 MB.`;
    }
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // Check total photo limit
    if (photos.length + files.length > MAX_PHOTOS) {
      newErrors.push(`You can only upload up to ${MAX_PHOTOS} photos. You currently have ${photos.length} photos.`);
      setErrors(newErrors);
      return;
    }

    // Validate each file
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    // Add valid files
    if (validFiles.length > 0) {
      const newPhotos = validFiles.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
    }

    // Set errors if any
    setErrors(newErrors);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photoToRemove = prev.find(p => p.id === id);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return prev.filter(p => p.id !== id);
    });
    // Clear errors when removing photos
    setErrors([]);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;

    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[draggedIndex];
    
    // Remove from old position
    newPhotos.splice(draggedIndex, 1);
    
    // Insert at new position
    newPhotos.splice(dropIndex, 0, draggedPhoto);
    
    setPhotos(newPhotos);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canProceed = photos.length >= 1;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Add photos of your vehicle
        </h1>
        <p className="text-lg text-gray-700">
          📸 Upload high-quality photos to attract renters
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Vehicle Photos
              <Badge variant="secondary" className="text-xs">Required</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Photos will be shown in the same order to renters. Upload interior, exterior, and key features.
              Maximum 20 photos, each up to 25 MB (JPG, PNG, or WebP).
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photos.length >= MAX_PHOTOS}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                >
                  <Upload className="h-4 w-4" />
                  <span>Add Photo</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Photo Count */}
              <div className="text-center text-sm text-gray-500">
                {photos.length}/{MAX_PHOTOS} photos uploaded
                {photos.length >= 1 && (
                  <span className="text-green-600 ml-2">✓ Minimum requirement met</span>
                )}
              </div>

              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-800">{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Photos Grid */}
        {photos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Uploaded Photos</CardTitle>
              <p className="text-sm text-gray-600">
                Drag and drop photos to reorder them. The first photo will be the main image shown to renters.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group bg-white border-2 rounded-lg overflow-hidden cursor-move transition-all ${
                      dragOverIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    } ${draggedIndex === index ? 'opacity-50' : ''}`}
                  >
                    {/* Main Photo Badge */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-blue-600 text-white text-xs">Main Photo</Badge>
                      </div>
                    )}

                    {/* Drag Handle */}
                    <div className="absolute top-2 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black bg-opacity-50 rounded p-1">
                        <GripVertical className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    {/* Photo */}
                    <div className="aspect-square">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Photo Info */}
                    <div className="p-2 bg-gray-50">
                      <p className="text-xs text-gray-600 truncate" title={photo.name}>
                        {photo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(photo.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {photos.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Camera className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No photos uploaded yet</p>
                <p className="text-sm mb-4">Add at least 1 photo to continue to the next step</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Photo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requirements Notice */}
        {!canProceed && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              ⚠️ Please upload at least 1 photo to continue to the next step.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
    </div>
  );
}