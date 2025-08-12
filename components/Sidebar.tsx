"use client";

import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentStep: string;
  currentSubStep: string;
  onSubStepChange: (subStep: string) => void;
  onStepChange: (step: string) => void;
}

export function Sidebar({ currentStep, currentSubStep, onSubStepChange, onStepChange }: SidebarProps) {
  const steps = [
    { id: 'vin', label: 'VIN', status: 'completed' },
    { 
      id: 'overview', 
      label: 'OVERVIEW', 
      status: currentStep === 'overview' ? 'current' : 
              ['vin'].includes(currentStep) ? 'upcoming' : 'completed',
      subSteps: [
        { id: 'specifications', label: 'Specifications' },
        { id: 'features', label: 'Features' }
      ]
    },
    { 
      id: 'photos', 
      label: 'PHOTOS', 
      status: currentStep === 'photos' ? 'current' : 
              ['vin', 'overview'].includes(currentStep) ? 'upcoming' : 'completed'
    },
    { 
      id: 'description', 
      label: 'DESCRIPTION', 
      status: currentStep === 'description' ? 'current' : 
              ['vin', 'overview', 'photos'].includes(currentStep) ? 'upcoming' : 'completed',
      subSteps: [
        { id: 'vehicle-info', label: 'Vehicle Info' },
        { id: 'faqs', label: 'FAQs' }
      ]
    },
    { 
      id: 'location', 
      label: 'LOCATION', 
      status: currentStep === 'location' ? 'current' : 
              ['vin', 'overview', 'photos', 'description'].includes(currentStep) ? 'upcoming' : 'completed'
    },
    { 
      id: 'pricing', 
      label: 'PRICING', 
      status: currentStep === 'pricing' ? 'current' : 
              ['vin', 'overview', 'photos', 'description', 'location'].includes(currentStep) ? 'upcoming' : 'completed',
      subSteps: [
        { id: 'base', label: 'Base Pricing' },
        { id: 'addon', label: 'Add-ons' },
        { id: 'penalties', label: 'Penalties' }
      ]
    },
    { 
      id: 'discount', 
      label: 'DISCOUNT', 
      status: currentStep === 'discount' ? 'current' : 
              ['vin', 'overview', 'photos', 'description', 'location', 'pricing'].includes(currentStep) ? 'upcoming' : 'completed'
    },
  ];

  const getStepIcon = (step: any, index: number) => {
    if (step.status === 'completed') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
          <Check className="h-5 w-5" />
        </div>
      );
    } else if (step.status === 'current') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">
          {index + 1}
        </div>
      );
    } else {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-medium">
          {index + 1}
        </div>
      );
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 px-6 py-8 fixed h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">AetherAI</h1>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id}>
            <div className="flex items-center space-x-3">
              {getStepIcon(step, index)}
              <span className={cn(
                "text-sm font-medium",
                step.status === 'current' ? 'text-blue-600' : 
                step.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
              )}>
                {step.label}
              </span>
            </div>

            {step.subSteps && step.status === 'current' && (
              <div className="ml-11 mt-3 space-y-2">
                {step.subSteps.map((subStep) => (
                  <button
                    key={subStep.id}
                    onClick={() => onSubStepChange(subStep.id)}
                    className={cn(
                      "flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      currentSubStep === subStep.id 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {subStep.label}
                    {currentSubStep === subStep.id && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer with avatar */}
      <div className="mt-auto pt-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white text-sm font-medium">
          N
        </div>
      </div>
    </div>
  );
}