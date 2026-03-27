import React, { useState } from 'react';
import { useAppStore } from '../../state/appStore';
import { CATEGORY_ANCHORS } from '../../types/categories';
import { Info } from 'lucide-react';
import { ProUpsellModal } from '../ui/ProUpsellModal';

export const ItemForm: React.FC = () => {
  const { currentInput, updateInput, settings } = useAppStore();
  const [showUpsell, setShowUpsell] = useState(false);

  // Extract unique categories
  const categories = Array.from(new Set(CATEGORY_ANCHORS.map(a => a.category)));
  const subcategories = CATEGORY_ANCHORS.filter(a => a.category === currentInput.category).map(a => a.subcategory);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = e.target.value;
    const isProCat = CATEGORY_ANCHORS.find(a => a.category === selectedCat)?.isPro;
    
    if (isProCat && !settings.premiumUnlocked) {
      setShowUpsell(true);
      return;
    }
    
    updateInput({ category: selectedCat, subcategory: '' });
  };

  return (
    <div className="space-y-4">
      <ProUpsellModal 
        isOpen={showUpsell} 
        onClose={() => setShowUpsell(false)} 
        featureName="Advanced Category Packs"
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-forest-black uppercase tracking-wider flex items-center gap-1">
            Category
          </label>
          <select 
            className="w-full border border-cool-gray-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forest-black"
            value={currentInput.category || ''}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>Select Category</option>
            {categories.map(c => {
              const isPro = CATEGORY_ANCHORS.find(a => a.category === c)?.isPro;
              return (
                <option key={c} value={c}>
                  {c} {isPro ? '(Pro)' : ''}
                </option>
              );
            })}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-forest-black uppercase tracking-wider flex items-center gap-1">
            Item Type
          </label>
          <select 
            className="w-full border border-cool-gray-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forest-black disabled:opacity-50"
            value={currentInput.subcategory || ''}
            onChange={(e) => updateInput({ subcategory: e.target.value })}
            disabled={!currentInput.category}
          >
            <option value="" disabled>Select Type</option>
            {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-forest-black uppercase tracking-wider flex items-center gap-1">
            Condition
          </label>
          <select 
            className="w-full border border-cool-gray-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forest-black"
            value={currentInput.condition || 'good'}
            onChange={(e) => updateInput({ condition: e.target.value as any })}
          >
            <option value="new">New / Open Box</option>
            <option value="likeNew">Like New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="parts">Parts / As-Is</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-forest-black uppercase tracking-wider flex items-center gap-1">
            Brand Tier
            <Info className="w-3 h-3 text-cool-gray cursor-help" title="Tier A: Apple, Sony. Tier B: Samsung, LG. Tier C: Vizio, TCL." />
          </label>
          <select 
            className="w-full border border-cool-gray-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forest-black"
            value={currentInput.brandTier || 'tierB'}
            onChange={(e) => updateInput({ brandTier: e.target.value as any })}
          >
            <option value="tierA">Premium / High Demand</option>
            <option value="tierB">Recognized Brand</option>
            <option value="tierC">Budget Brand</option>
            <option value="generic">Generic / Unbranded</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-forest-black uppercase tracking-wider flex items-center gap-1">
            Age
          </label>
          <select 
            className="w-full border border-cool-gray-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forest-black"
            value={currentInput.ageBand || '1-3'}
            onChange={(e) => updateInput({ ageBand: e.target.value as any })}
          >
            <option value="0-1">Under 1 Year</option>
            <option value="1-3">1 - 3 Years</option>
            <option value="3-5">3 - 5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-forest-black uppercase tracking-wider flex items-center gap-1">
            Accessories
            <Info className="w-3 h-3 text-cool-gray cursor-help" title="Does it include the original box, charger, or essential cables?" />
          </label>
          <select 
            className="w-full border border-cool-gray-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forest-black"
            value={currentInput.accessories?.length ? 'yes' : 'no'}
            onChange={(e) => updateInput({ accessories: e.target.value === 'yes' ? ['box', 'charger'] : [] })}
          >
            <option value="no">None / Missing</option>
            <option value="yes">Included (Box, Cables)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-forest-black uppercase tracking-wider flex items-center gap-1">
          Urgency
          <Info className="w-3 h-3 text-cool-gray cursor-help" title="How fast do you need to sell? Faster sales require lower prices." />
        </label>
        <select 
          className="w-full border border-cool-gray-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forest-black"
          value={currentInput.urgency || 'normal'}
          onChange={(e) => updateInput({ urgency: e.target.value as any })}
        >
          <option value="relaxed">Relaxed (Max Profit)</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast (Discounted)</option>
          <option value="urgent">Urgent (Liquidation)</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-forest-black uppercase tracking-wider">Strategy</label>
        <div className="flex bg-gray-100 p-1 rounded-md">
          {(['profit', 'balanced', 'speed'] as const).map((strat) => (
            <button
              key={strat}
              className={`flex-1 py-1.5 text-xs font-medium rounded-sm transition-colors capitalize ${currentInput.strategy === strat ? 'bg-white shadow-sm text-forest-black' : 'text-cool-gray hover:text-forest-black'}`}
              onClick={() => updateInput({ strategy: strat })}
            >
              {strat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
