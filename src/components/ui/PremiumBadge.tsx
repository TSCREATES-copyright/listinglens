import React from 'react';
import { Zap } from 'lucide-react';

interface PremiumBadgeProps {
  text?: string;
  className?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ text = "PRO", className = "" }) => {
  return (
    <span className={`inline-flex items-center gap-1 bg-gold text-forest-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${className}`}>
      <Zap className="w-3 h-3" />
      {text}
    </span>
  );
};
