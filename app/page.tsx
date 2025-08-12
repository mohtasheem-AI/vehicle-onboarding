"use client";

import { useState } from 'react';
import { VehicleOnboarding } from '@/components/VehicleOnboarding';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VehicleOnboarding />
    </div>
  );
}