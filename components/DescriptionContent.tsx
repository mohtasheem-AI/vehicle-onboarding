"use client";

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleInfoContent } from '@/components/VehicleInfoContent';
import { FAQsContent } from '@/components/FAQsContent';

interface DescriptionContentProps {
  currentSubStep: string;
  onSubStepChange: (subStep: string) => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

export function DescriptionContent({ currentSubStep, onSubStepChange, onPreviousStep, onNextStep }: DescriptionContentProps) {
  const handleContinue = () => {
    if (currentSubStep === 'vehicle-info') {
      onSubStepChange('faqs');
    } else {
      onNextStep();
    }
  };

  const handleBack = () => {
    if (currentSubStep === 'faqs') {
      onSubStepChange('vehicle-info');
    } else {
      onPreviousStep();
    }
  };

  const getStepInfo = () => {
    if (currentSubStep === 'vehicle-info') {
      return { title: '📝 Create an engaging description', step: '3 of 7' };
    } else {
      return { title: '❓ Add Frequently Asked Questions', step: '3 of 7' };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {currentSubStep === 'vehicle-info' ? 'Describe your vehicle' : 'Add FAQs for your vehicle'}
        </h1>
        <p className="text-lg text-gray-700">
          {stepInfo.title}
        </p>
      </div>

      <div className="mb-8">
        {currentSubStep === 'vehicle-info' ? (
          <VehicleInfoContent />
        ) : (
          <FAQsContent />
        )}
      </div>
    </div>
  );
}