import React, { useState } from 'react';
import { useLicense } from '../../hooks/useLicense';
import { ProUpsellModal } from './ProUpsellModal';

interface ProFeatureGateProps {
  children: React.ReactNode;
  featureName?: string;
  fallback?: React.ReactNode;
}

export const ProFeatureGate: React.FC<ProFeatureGateProps> = ({ children, featureName, fallback }) => {
  const { isPro } = useLicense();
  const [showUpsell, setShowUpsell] = useState(false);

  if (isPro) {
    return <>{children}</>;
  }

  if (fallback) {
    return (
      <>
        {React.isValidElement(fallback) ? React.cloneElement(fallback, {
          onClickCapture: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setShowUpsell(true);
          }
        } as any) : (
          <div onClickCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowUpsell(true);
          }}>
            {fallback}
          </div>
        )}
        <ProUpsellModal 
          isOpen={showUpsell} 
          onClose={() => setShowUpsell(false)} 
          featureName={featureName}
        />
      </>
    );
  }

  return (
    <>
      <div 
        className="relative cursor-pointer group"
        onClickCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowUpsell(true);
        }}
      >
        <div className="pointer-events-none opacity-50 transition-opacity group-hover:opacity-40">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-forest-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            Unlock Pro required
          </span>
        </div>
      </div>
      <ProUpsellModal 
        isOpen={showUpsell} 
        onClose={() => setShowUpsell(false)} 
        featureName={featureName}
      />
    </>
  );
};
