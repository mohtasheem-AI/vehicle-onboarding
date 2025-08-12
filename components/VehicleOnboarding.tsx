"use client";

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { OverviewContent } from '@/components/OverviewContent';
import { DescriptionContent } from '@/components/DescriptionContent';
import { PhotosContent } from '@/components/PhotosContent';
import PricingContent from '@/components/PricingContent';
import { LocationContent } from '@/components/LocationContent';

export function VehicleOnboarding() {
  const [currentStep, setCurrentStep] = useState('overview');
  const [currentSubStep, setCurrentSubStep] = useState('specifications');

  const handleStepChange = (step: string) => {
    setCurrentStep(step);
    if (step === 'overview') {
      setCurrentSubStep('specifications');
    } else if (step === 'description') {
      setCurrentSubStep('vehicle-info');
    } else if (step === 'pricing') {
      setCurrentSubStep('base');
    } else {
      setCurrentSubStep('');
    }
  };

  const handleNextStep = () => {
    const stepOrder = ['overview', 'photos', 'description', 'location', 'pricing', 'discount'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      handleStepChange(stepOrder[currentIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const stepOrder = ['overview', 'photos', 'description', 'location', 'pricing', 'discount'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      handleStepChange(stepOrder[currentIndex - 1]);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentStep={currentStep}
        currentSubStep={currentSubStep}
        onSubStepChange={setCurrentSubStep}
        onStepChange={handleStepChange}
      />
      <main className="flex-1 ml-80 flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 pb-24">
        {currentStep === 'overview' && (
          <OverviewContent 
            currentSubStep={currentSubStep}
            onSubStepChange={setCurrentSubStep}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
          />
        )}
        {currentStep === 'description' && (
          <DescriptionContent 
            currentSubStep={currentSubStep}
            onSubStepChange={setCurrentSubStep}
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}
          />
        )}
        {currentStep === 'photos' && (
          <PhotosContent 
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}
          />
        )}
        {currentStep === 'pricing' && (
          <PricingContent 
            currentSubStep={currentSubStep}
            onSubStepChange={setCurrentSubStep}
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}
          />
        )}
        {currentStep === 'location' && (
          <LocationContent 
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}
          />
        )}
        </div>
        
        {/* Fixed Navigation */}
        <div className="fixed bottom-0 right-0 left-80 border-t border-gray-200 bg-white px-8 py-4 z-10">
          <div className="flex items-center justify-between max-w-4xl">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <span className="text-sm text-gray-500">
              Step {['overview', 'photos', 'description', 'location', 'pricing', 'discount'].indexOf(currentStep) + 1} of 6
            </span>

            <Button
              onClick={handleNextStep}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}