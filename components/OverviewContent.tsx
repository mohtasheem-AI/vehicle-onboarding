"use client";

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleSpecifications } from '@/components/VehicleSpecifications';
import { VehicleFeatures } from '@/components/VehicleFeatures';

interface OverviewContentProps {
  currentSubStep: string;
  onSubStepChange: (subStep: string) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export function OverviewContent({ currentSubStep, onSubStepChange, onNextStep, onPreviousStep }: OverviewContentProps) {
  const handleContinue = () => {
    if (currentSubStep === 'specifications') {
      onSubStepChange('features');
    } else {
      onNextStep();
    }
  };

  const handleBack = () => {
    if (currentSubStep === 'features') {
      onSubStepChange('specifications');
    } else {
      // Can't go back from first substep of first step
      return;
    }
  };

  const getStepInfo = () => {
    if (currentSubStep === 'specifications') {
      return { title: '🧑‍💻 Set Vehicle Specifications', step: '1 of 4' };
    } else {
      return { title: '✨ Select Vehicle Features', step: '2 of 4' };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Enter your vehicle information
        </h1>
        <p className="text-lg text-gray-700">
          {stepInfo.title}
        </p>
      </div>

      <div className="mb-8">
        {currentSubStep === 'specifications' ? (
          <VehicleSpecifications />
        ) : (
          <VehicleFeatures />
        )}
      </div>
    </div>
  );
}