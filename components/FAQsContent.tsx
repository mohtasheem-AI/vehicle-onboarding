"use client";

import { useState } from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function FAQsContent() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string>('');

  const addFAQ = () => {
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    };
    setFaqs(prev => [...prev, newFAQ]);
    // Open the newly added FAQ for editing
    setOpenAccordion(newFAQ.id);
  };

  const removeFAQ = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    // If the removed FAQ was open, close the accordion
    if (openAccordion === id) {
      setOpenAccordion('');
    }
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  const addCommonQuestion = (question: string) => {
    const newFAQ: FAQ = {
      id: Date.now().toString() + Math.random(),
      question: question,
      answer: ''
    };
    setFaqs(prev => [...prev, newFAQ]);
    // Open the newly added FAQ for editing
    setOpenAccordion(newFAQ.id);
  };

  const commonQuestions = [
    "Is the vehicle pet-friendly?",
    "What's included with the rental?",
    "Where should I pick up the keys?",
    "Is smoking allowed in the vehicle?",
    "What happens if I return the car late?",
    "Are there any mileage restrictions?",
    "What should I do in case of an emergency?",
    "Is the vehicle suitable for long trips?"
  ];

  const faqTips = [
    "Address common concerns about pickup/dropoff procedures",
    "Clarify any special rules or restrictions",
    "Explain what's included (insurance, fuel policy, etc.)",
    "Provide emergency contact information",
    "Mention any unique features or quirks of your vehicle"
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Frequently Asked Questions
            <Badge variant="outline" className="text-xs">Optional</Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Help renters by answering common questions upfront. This reduces back-and-forth messages and builds trust.
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">FAQ Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {faqTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-blue-600">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Common Questions Suggestions */}
      {faqs.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Common Questions</CardTitle>
            <p className="text-sm text-gray-600">
              Here are some questions that renters frequently ask. Click to add them as a starting point.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {commonQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addCommonQuestion(question)}
                  className="justify-start text-left h-auto py-2 px-3 whitespace-normal"
                >
                  <Plus className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Accordion */}
      {faqs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Your FAQs</CardTitle>
            <p className="text-sm text-gray-600">
              Click on any FAQ to edit it. All accordions will collapse when you add a new FAQ.
            </p>
          </CardHeader>
          <CardContent>
            <Accordion 
              type="single" 
              collapsible 
              value={openAccordion} 
              onValueChange={setOpenAccordion}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="border border-gray-200 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          FAQ #{index + 1}
                        </span>
                        {faq.question && (
                          <span className="text-sm text-gray-600 truncate max-w-md">
                            {faq.question}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFAQ(faq.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`question-${faq.id}`}>Question</Label>
                        <Input
                          id={`question-${faq.id}`}
                          placeholder="Enter your question (max 120 characters)"
                          value={faq.question}
                          onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                          maxLength={120}
                        />
                        <div className="text-xs text-gray-500 text-right">
                          {faq.question.length}/120 characters
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
                        <Textarea
                          id={`answer-${faq.id}`}
                          placeholder="Provide a clear and helpful answer (max 500 characters)"
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                          className="min-h-[80px] resize-none"
                          maxLength={500}
                        />
                        <div className="text-xs text-gray-500 text-right">
                          {faq.answer.length}/500 characters
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Add FAQ Button */}
      <div className="flex justify-center">
        <Button
          onClick={addFAQ}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Another FAQ</span>
        </Button>
      </div>

      {/* Preview */}
      {faqs.length > 0 && faqs.some(faq => faq.question.trim() && faq.answer.trim()) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Preview</CardTitle>
            <p className="text-sm text-gray-600">
              This is how your FAQs will appear to renters
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs
                  .filter(faq => faq.question.trim() && faq.answer.trim())
                  .map((faq, index) => (
                    <AccordionItem 
                      key={`preview-${faq.id}`} 
                      value={`preview-${faq.id}`}
                      className="bg-white border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-3">
                        <span className="text-sm font-medium text-left">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <p className="text-gray-700 text-sm">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {faqs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No FAQs added yet</p>
          <p className="text-sm mb-4">Add frequently asked questions to help renters understand your vehicle better</p>
          <Button onClick={addFAQ} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First FAQ
          </Button>
        </div>
      )}
    </div>
  );
}