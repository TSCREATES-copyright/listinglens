import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/appStore';
import { Button } from '../components/ui/Button';
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: "Welcome to ListingLens",
    content: "ListingLens is a deterministic, browser-only resale pricing tool for flippers, side hustlers, and marketplace sellers. It helps you price and sell used items for local resale platforms like Facebook Marketplace and Craigslist without leaving money on the table.",
    image: "🎯"
  },
  {
    title: "1. The Core Problem",
    content: "Pricing used items is messy and emotional. Most people guess, compare a few listings manually, and either underprice and lose profit, or overprice and get no messages. ListingLens solves this by giving you a fast, credible answer to 'What should I list this for?'",
    image: "🤔"
  },
  {
    title: "2. Enter Item Details",
    content: "Start by selecting your category, condition, and brand tier. The engine uses these inputs to calculate depreciation and demand. The more accurate you are, the better the pricing recommendation.",
    image: "📝"
  },
  {
    title: "3. Choose Your Strategy",
    content: "Need cash today? Choose 'Fast Sale'. Willing to wait for the right buyer? Choose 'Max Profit'. The engine adjusts the pricing and negotiation buffer automatically based on your urgency.",
    image: "⚖️"
  },
  {
    title: "4. Read the Output",
    content: "You'll get a List Price (what to post it for), a Likely Sell Price (what you'll actually get), and a Negotiation Buffer (your wiggle room). This gives you confidence when dealing with buyers.",
    image: "💰"
  },
  {
    title: "5. Listing Templates",
    content: "Copy and paste these proven structures into your marketplace listings for faster sales. A good listing title and description can significantly increase your sell-through rate.",
    image: "📋",
    examples: [
      "Title: [Brand] [Item] - Excellent Condition - Local Pickup",
      "Bullets: ✅ Tested & Working ✅ Cleaned ✅ Includes Box",
      "Negotiation: Price is firm. Lowballers will be ignored."
    ]
  },
  {
    title: "6. Save & Build History (Vault)",
    content: "Save your valuations to build a personal pricing vault. Over time, you'll learn exactly what works in your local market. Free users can save up to 3 items. Pro users get unlimited saves.",
    image: "🏦"
  },
  {
    title: "7. ListingDemand Simulator (Pro)",
    content: "Unlock Pro to access the ListingDemand simulator. This gamified feature lets you test pricing variations, urgency changes, and compare sell-speed outcomes in a sandbox environment.",
    image: "🚀"
  }
];

export const TutorialOverlay: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  const isOpen = !settings.tutorialCompleted;

  const handleClose = () => {
    updateSettings({ tutorialCompleted: true });
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gold-dark font-bold text-sm">
            <Lightbulb className="w-4 h-4" /> Quick Guide
          </div>
          <button onClick={handleClose} className="text-cool-gray hover:text-forest-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex-1 flex flex-col items-center text-center">
          <div className="text-6xl mb-6">{step.image === 'Vault' ? '🏦' : step.image}</div>
          <h2 className="text-xl font-bold text-forest-black mb-3">{step.title}</h2>
          <p className="text-cool-gray text-sm leading-relaxed mb-4">{step.content}</p>
          {step.examples && (
            <div className="bg-gray-50 w-full p-4 rounded-lg border border-gray-200 text-xs font-mono text-left text-forest-black space-y-2 overflow-y-auto max-h-40">
              {step.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">›</span>
                  <span className="select-all">{ex}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex gap-1">
            {TUTORIAL_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-6 bg-forest-black' : 'w-1.5 bg-cool-gray-light'}`} 
              />
            ))}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={handlePrev}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleNext}>
              {currentStep === TUTORIAL_STEPS.length - 1 ? 'Get Started' : 'Next'} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
