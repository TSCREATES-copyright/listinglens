import { ValuationRecord } from '../types/valuation';
import { CATEGORY_ANCHORS } from '../types/categories';
import { clamp } from '../utils/clamp';

export interface EngineOutput {
  listPrice: number;
  likelySellPrice: number;
  fastSalePrice: number;
  negotiationBuffer: number;
  confidence: number;
  title: string;
  warnings: string[];
}

const CONDITION_MULTIPLIERS: Record<ValuationRecord['condition'], number> = {
  new: 1.05,
  likeNew: 0.95,
  excellent: 0.85,
  good: 0.70,
  fair: 0.50,
  parts: 0.25,
};

const BRAND_WEIGHTS: Record<ValuationRecord['brandTier'], number> = {
  tierA: 1.25,
  tierB: 1.05,
  tierC: 0.90,
  generic: 0.75,
};

const AGE_FACTORS: Record<ValuationRecord['ageBand'], number> = {
  '0-1': 0.95,
  '1-3': 0.80,
  '3-5': 0.65,
  '5+': 0.50,
};

const URGENCY_FACTORS: Record<ValuationRecord['urgency'], number> = {
  relaxed: 1.0,
  normal: 0.95,
  fast: 0.85,
  urgent: 0.70,
};

const STRATEGY_FACTORS: Record<ValuationRecord['strategy'], number> = {
  profit: 1.05,
  balanced: 1.0,
  speed: 0.90,
};

export const calculateValuation = (inputs: Partial<ValuationRecord>): EngineOutput => {
  const warnings: string[] = [];
  
  // 1. Find Anchor
  const anchor = CATEGORY_ANCHORS.find(
    a => a.category === inputs.category && a.subcategory === inputs.subcategory
  );
  
  const basePrice = anchor ? anchor.basePrice : 50; // Fallback
  
  if (!anchor) {
    warnings.push("Category not found in anchor table. Using generic baseline.");
  }

  // 2. Apply Multipliers
  const conditionMult = inputs.condition ? CONDITION_MULTIPLIERS[inputs.condition] : 0.8;
  const brandMult = inputs.brandTier ? BRAND_WEIGHTS[inputs.brandTier] : 0.9;
  const ageMult = inputs.ageBand ? AGE_FACTORS[inputs.ageBand] : 0.8;
  
  // Accessories: +5% each, max 15%
  const accessoryCount = inputs.accessories?.length || 0;
  const accessoryMult = 1 + clamp(accessoryCount * 0.05, 0, 0.15);

  const adjustedValue = basePrice * conditionMult * brandMult * ageMult * accessoryMult;

  // 3. Strategy & Urgency
  const urgencyMult = inputs.urgency ? URGENCY_FACTORS[inputs.urgency] : 0.95;
  const strategyMult = inputs.strategy ? STRATEGY_FACTORS[inputs.strategy] : 1.0;
  
  // Bulky items discount more on urgency
  let finalUrgencyMult = urgencyMult;
  if (anchor?.demandTier === 'low' && inputs.urgency === 'urgent') {
    finalUrgencyMult -= 0.1; // Extra penalty for hard to move items
    warnings.push("Bulky/low-demand item marked urgent. Expect heavy discounting.");
  }

  const strategyAdjusted = adjustedValue * finalUrgencyMult * strategyMult;

  // 4. Outputs
  // Negotiation cushion is typically 10-20% above likely sell price
  const cushionFactor = inputs.strategy === 'speed' ? 1.05 : 1.15;
  
  let listPrice = Math.round(strategyAdjusted * cushionFactor);
  let likelySellPrice = Math.round(strategyAdjusted);
  let fastSalePrice = Math.round(strategyAdjusted * 0.85); // 15% below likely

  // 5. Confidence Score (0-100)
  let confidence = 100;
  if (!anchor) confidence -= 30;
  if (!inputs.brandTier || inputs.brandTier === 'generic') confidence -= 10;
  if (inputs.condition === 'fair' || inputs.condition === 'parts') confidence -= 15;
  if (anchor?.volatility && anchor.volatility > 0.15) confidence -= 10;
  
  confidence = clamp(Math.round(confidence), 0, 100);

  if (confidence < 60) {
    warnings.push("Low confidence. Item may be highly variable or inputs are vague.");
  }

  // 6. Title Generation
  const conditionStr = inputs.condition ? inputs.condition.replace(/([A-Z])/g, ' $1').trim() : '';
  const conditionDisplay = conditionStr.charAt(0).toUpperCase() + conditionStr.slice(1);
  const title = `[Brand] ${inputs.subcategory || 'Item'} - ${conditionDisplay} Condition${accessoryCount > 0 ? ' + Extras' : ''}`;

  return {
    listPrice,
    likelySellPrice,
    fastSalePrice,
    negotiationBuffer: listPrice - likelySellPrice,
    confidence,
    title,
    warnings
  };
};
