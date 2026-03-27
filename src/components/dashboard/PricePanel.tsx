import React, { useMemo } from 'react';
import { useAppStore } from '../../state/appStore';
import { calculateValuation } from '../../systems/CoreEngine';
import { formatCurrency } from '../../utils/formatCurrency';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertCircle, Zap, Target, ShieldAlert, Info } from 'lucide-react';

export const PricePanel: React.FC = () => {
  const { currentInput } = useAppStore();

  const output = useMemo(() => {
    if (!currentInput.category || !currentInput.subcategory) return null;
    return calculateValuation(currentInput);
  }, [currentInput]);

  if (!output) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 border-dashed">
        <Target className="w-12 h-12 text-cool-gray-light mb-4" />
        <h3 className="text-lg font-medium text-forest-black">Ready to Price ✅

        </h3>
        <p className="text-sm text-cool-gray mt-1">👈
          Select a category and item type to see instant valuation.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-forest-black overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-bright-lime" />
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-cool-gray uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Recommended List Price
              <Info className="w-3 h-3 cursor-help" title="The price you should put on your listing to leave room for negotiation." />
            </p>
            <h1 className="text-5xl font-bold text-forest-black tracking-tight">{formatCurrency(output.listPrice)}</h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <p className="text-xs font-medium text-cool-gray uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                Likely Sell Price
                <Info className="w-3 h-3 cursor-help" title="The actual amount you can expect to pocket after negotiations." />
              </p>
              <p className="text-2xl font-bold text-forest-dark">{formatCurrency(output.likelySellPrice)}</p>
            </div>
            <div className="bg-bright-lime/10 rounded-lg p-4 text-center border border-bright-lime/20">
              <p className="text-xs font-medium text-bright-lime-dark uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> Fast Sale
                <Info className="w-3 h-3 cursor-help" title="Price it here if you need cash today. Expect multiple messages quickly." />
              </p>
              <p className="text-2xl font-bold text-forest-dark">{formatCurrency(output.fastSalePrice)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold text-cool-gray uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Negotiation Buffer
              <Info className="w-3 h-3 cursor-help" title="The difference between your list price and your likely sell price." />
            </p>
            <p className="text-xl font-bold text-forest-black">{formatCurrency(output.negotiationBuffer)}</p>
            <p className="text-xs text-cool-gray mt-1">Room for offers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold text-cool-gray uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              Confidence
              <Info className="w-3 h-3 cursor-help" title="How accurate this estimate is based on the item's age, condition, and category volatility." />
            </p>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-bright-lime"
                    strokeDasharray={`${output.confidence}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
                <span className="text-sm font-bold text-forest-black">{output.confidence}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {output.warnings.length > 0 && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-gold-dark">Pricing Insights</h4>
              <ul className="mt-1 space-y-1">
                {output.warnings.map((w, i) => (
                  <li key={i} className="text-xs text-forest-dark">{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Suggested Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 font-mono text-sm text-forest-black break-words">
            {output.title}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
