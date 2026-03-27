import React, { useState } from 'react';
import { ItemForm } from '../tools/ItemForm';
import { PricePanel } from './PricePanel';
import { HistoryView } from './HistoryView';
import { SaveActionPanel } from './SaveActionPanel';
import { TradeSimulator } from '../../gamification/TradeSimulator';
import { TutorialOverlay } from '../../walkthrough/TutorialOverlay';
import { ToastDisplay } from '../../systems/ToastDisplay';
import { useAppStore } from '../../state/appStore';
import { Settings, HelpCircle, Shield, Rocket } from 'lucide-react';
import { PremiumBadge } from '../ui/PremiumBadge';

export const DashboardShell: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [activeTab, setActiveTab] = useState<'tools' | 'pro'>('tools');

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <ToastDisplay />
      <TutorialOverlay />

      {/* Header */}
      <header className="bg-forest-black text-white py-4 px-6 shadow-md z-10 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-bright-lime rounded-md flex items-center justify-center shadow-inner">
              <div className="w-3 h-3 bg-forest-black rounded-sm" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ListingLens</h1>
            {settings.premiumUnlocked && (
              <PremiumBadge className="ml-2" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => updateSettings({ tutorialCompleted: false })}
              className="text-cool-gray hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <HelpCircle className="w-4 h-4" /> Guide
            </button>
            <button 
              onClick={() => setActiveTab(activeTab === 'pro' ? 'tools' : 'pro')}
              className="text-cool-gray hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <Rocket className="w-4 h-4" /> ListingDemand
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-cool-gray-light p-6">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-forest-black">Item Details 🏷️</h2>
              <p className="text-xs text-cool-gray mt-1">Configure your item for instant valuation.</p>
            </div>
            <ItemForm />
          </div>
          <SaveActionPanel />
        </div>

        {/* Center Column: Outputs */}
        <div className="lg:col-span-5 space-y-6">
          <PricePanel />
        </div>

        {/* Right Column: Tools & History */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <div className="flex bg-gray-200/50 p-1 rounded-lg">
            <button 
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'tools' ? 'bg-white shadow-sm text-forest-black' : 'text-cool-gray hover:text-forest-black'}`} 
              onClick={() => setActiveTab('tools')}
            >
              Vault 🗃️
            </button>
            <button 
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === 'pro' ? 'bg-white shadow-sm text-forest-black' : 'text-cool-gray hover:text-forest-black'}`} 
              onClick={() => setActiveTab('pro')}
            >
              <Rocket className="w-3.5 h-3.5" /> ListingDemand
            </button>
          </div>

          {activeTab === 'pro' ? (
            <div className="animate-in fade-in slide-in-from-top-4 space-y-6">
              <TradeSimulator />
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              <HistoryView />
            </div>
          )}
        </div>

      </main>
    </div>
  );
};
