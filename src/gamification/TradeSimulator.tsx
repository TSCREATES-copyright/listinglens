import React, { useState } from 'react';
import { useAppStore } from '../state/appStore';
import { calculateValuation } from '../systems/CoreEngine';
import { formatCurrency } from '../utils/formatCurrency';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Sliders, ArrowRight, TrendingUp, TrendingDown, AlertCircle, Lock } from 'lucide-react';
import { ProFeatureGate } from '../components/ui/ProFeatureGate';
import { PremiumBadge } from '../components/ui/PremiumBadge';

export const TradeSimulator: React.FC = () => {
  const { currentInput } = useAppStore();
  
  // Local state for simulation
  const [simInput, setSimInput] = useState(currentInput);
  
  // Sync when currentInput changes
  React.useEffect(() => {
    setSimInput(currentInput);
  }, [currentInput]);

  const fallback = (
    <Card className="bg-gray-50/50 border-dashed relative overflow-hidden cursor-pointer hover:border-gold/50 transition-colors">
      <PremiumBadge className="absolute top-0 right-0 rounded-bl-lg rounded-tr-none rounded-tl-none rounded-br-none" />
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="relative mb-3">
          <Sliders className="w-10 h-10 text-cool-gray-light" />
          <Lock className="w-4 h-4 text-gold-dark absolute -bottom-1 -right-1 bg-white rounded-full" />
        </div>
        <h3 className="text-sm font-semibold text-forest-black">ListingDemand Simulator</h3>
        <p className="text-xs text-cool-gray mt-1 max-w-[200px]">Unlock Pro to test pricing strategies and simulate outcomes.</p>
      </CardContent>
    </Card>
  );

  return (
    <ProFeatureGate featureName="ListingDemand Simulator" fallback={fallback}>
      <TradeSimulatorContent currentInput={currentInput} simInput={simInput} setSimInput={setSimInput} />
    </ProFeatureGate>
  );
};

const TradeSimulatorContent: React.FC<{ currentInput: any, simInput: any, setSimInput: any }> = ({ currentInput, simInput, setSimInput }) => {
  if (!currentInput.category) {
    return (
      <Card className="bg-gray-50/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-xs text-cool-gray">Select an item category first to use the simulator.</p>
        </CardContent>
      </Card>
    );
  }

  const baseOutput = calculateValuation(currentInput);
  const simOutput = calculateValuation(simInput);

  const profitDelta = simOutput.likelySellPrice - baseOutput.likelySellPrice;
  const speedDelta = baseOutput.fastSalePrice - simOutput.fastSalePrice; // Lower fast sale price = faster speed

  return (
    <Card className="border-gold/30">
      <CardHeader className="pb-2 border-b border-cool-gray-light/50 bg-gold/5 rounded-t-xl">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sliders className="w-4 h-4 text-gold-dark" />
          ListingDemand Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        
        {/* Scenario Controls */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-forest-black uppercase tracking-wider">Test Scenario</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-cool-gray uppercase mb-1 block">Strategy</label>
              <select 
                className="w-full border border-cool-gray-light rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-gold"
                value={simInput.strategy || 'balanced'}
                onChange={(e) => setSimInput({ ...simInput, strategy: e.target.value as any })}
              >
                <option value="profit">Max Profit</option>
                <option value="balanced">Balanced</option>
                <option value="speed">Fast Sale</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-cool-gray uppercase mb-1 block">Urgency</label>
              <select 
                className="w-full border border-cool-gray-light rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-gold"
                value={simInput.urgency || 'normal'}
                onChange={(e) => setSimInput({ ...simInput, urgency: e.target.value as any })}
              >
                <option value="relaxed">Relaxed</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="flex-1 text-xs py-1" onClick={() => setSimInput({ ...simInput, condition: 'excellent' })}>Clean it up</Button>
             <Button variant="outline" size="sm" className="flex-1 text-xs py-1" onClick={() => setSimInput({ ...simInput, accessories: ['box'] })}>Find Box</Button>
          </div>
        </div>

        {/* Outcome Comparison */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <p className="text-[10px] text-cool-gray uppercase tracking-wider mb-1">Current</p>
              <p className="text-sm font-bold text-forest-black">{formatCurrency(baseOutput.likelySellPrice)}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-cool-gray-light flex-shrink-0" />
            <div className="text-center flex-1">
              <p className="text-[10px] text-gold-dark uppercase tracking-wider mb-1">Simulated</p>
              <p className="text-sm font-bold text-forest-black">{formatCurrency(simOutput.likelySellPrice)}</p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cool-gray">Profit Impact</span>
              <span className={`font-bold flex items-center gap-1 ${profitDelta > 0 ? 'text-bright-lime-dark' : profitDelta < 0 ? 'text-red-500' : 'text-forest-black'}`}>
                {profitDelta > 0 ? <TrendingUp className="w-3 h-3" /> : profitDelta < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                {profitDelta > 0 ? '+' : ''}{formatCurrency(profitDelta)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-cool-gray">Confidence</span>
              <span className="font-bold text-forest-black">{simOutput.confidence} / 100</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-cool-gray">Est. Time to Sell</span>
              <span className="font-bold text-forest-black">
                {simInput.urgency === 'urgent' ? '1-2 Days' : simInput.urgency === 'fast' ? '3-5 Days' : simInput.urgency === 'relaxed' ? '2-4 Weeks' : '1-2 Weeks'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-cool-gray">Market Heat</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => {
                  const heatScore = simInput.urgency === 'urgent' ? 5 : simInput.urgency === 'fast' ? 4 : simInput.urgency === 'relaxed' ? 2 : 3;
                  return (
                    <div 
                      key={level} 
                      className={`w-3 h-3 rounded-sm ${level <= heatScore ? (heatScore >= 4 ? 'bg-red-500' : heatScore >= 3 ? 'bg-gold' : 'bg-bright-lime-dark') : 'bg-gray-200'}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {simOutput.warnings.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-gold-dark bg-gold/5 p-2 rounded">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{simOutput.warnings[0]}</span>
          </div>
        )}

      </CardContent>
    </Card>
  );
};
