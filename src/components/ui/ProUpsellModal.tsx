import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Key, X, CheckCircle, ArrowRight } from 'lucide-react';
import { useLicense } from '../../hooks/useLicense';
import { toastManager } from '../../systems/toastManager';

interface ProUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export const ProUpsellModal: React.FC<ProUpsellModalProps> = ({ isOpen, onClose, featureName }) => {
  const { activateLicense } = useLicense();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleUnlock = () => {
    if (activateLicense(key)) {
      toastManager.success("Premium Unlocked!", "Welcome to ListingLens Pro.");
      setError('');
      onClose();
    } else {
      setError("Invalid license key format or key not found.");
      toastManager.error("Unlock Failed", "Please check your key and try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forest-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col relative"
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-cool-gray hover:text-forest-black transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="bg-gradient-to-br from-forest-black to-forest-dark p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-bright-lime flex items-center justify-center shadow-lg mb-4">
                  <Zap className="w-8 h-8 text-forest-black" />
                </div>
                <h2 className="text-2xl font-black mb-2">Unlock Pro Features</h2>
                <p className="text-cool-gray-light text-sm max-w-xs mx-auto">
                  {featureName ? `Unlock Pro to access ${featureName} and supercharge your reselling business.` : 'Supercharge your reselling business with advanced tools.'}
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-baseline justify-center gap-1 mb-6">
                <span className="text-4xl font-black text-forest-black">$10</span>
                <span className="text-sm text-cool-gray font-medium uppercase tracking-wider">/ one-time</span>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "ListingDemand Simulator",
                  "Unlimited Saved Inventory (Vault)",
                  "Advanced Category Packs",
                  "Export to CSV",
                  "Priority Support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-forest-black font-medium">
                    <CheckCircle className="w-5 h-5 text-bright-lime-dark flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="text-xs font-bold text-forest-black uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Key className="w-3.5 h-3.5" /> Enter License Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="LENS-XXXX-XXXX"
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    className="flex-1 border border-cool-gray-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-mono uppercase bg-white shadow-sm"
                  />
                  <button
                    onClick={handleUnlock}
                    className="bg-forest-black text-white px-5 py-2.5 rounded-lg font-bold hover:bg-forest-dark transition-colors flex items-center gap-2 shadow-md whitespace-nowrap"
                  >
                    Unlock <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
