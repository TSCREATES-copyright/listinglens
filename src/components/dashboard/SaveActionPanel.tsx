import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../state/appStore';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { calculateValuation } from '../../systems/CoreEngine';
import { toastManager } from '../../systems/toastManager';
import { generateId } from '../../utils/id';
import { Button } from '../ui/Button';
import { Save, RefreshCw, Lock } from 'lucide-react';
import { ProFeatureGate } from '../ui/ProFeatureGate';
import { PremiumBadge } from '../ui/PremiumBadge';

export const SaveActionPanel: React.FC = () => {
  const { currentInput, clearInput, settings } = useAppStore();
  const { records, saveRecord } = useIndexedDB();
  const [isSaving, setIsSaving] = useState(false);

  const output = useMemo(() => {
    if (!currentInput.category || !currentInput.subcategory) return null;
    return calculateValuation(currentInput);
  }, [currentInput]);

  const handleSave = async () => {
    if (!output || !currentInput.category) return;

    setIsSaving(true);
    try {
      const record = {
        ...currentInput,
        ...output,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as any;
      
      await saveRecord(record);
      toastManager.success("Valuation Saved", "Added to your history vault.");
    } catch (e) {
      toastManager.error("Save Failed", "Could not save valuation.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    toastManager.confirm({
      title: "Reset Inputs?",
      message: "⚠️ This will clear all current item details.",
      confirmText: "Reset 🧹",
      cancelText: "Cancel",
      isDestructive: true,
      onConfirm: () => {
        clearInput();
        toastManager.info("Inputs Reset");
      }
    });
  };

  const isVaultFull = !settings.premiumUnlocked && records.length >= 3;

  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        className="flex-1 gap-2" 
        onClick={handleReset}
      >
        <RefreshCw className="w-4 h-4" /> Reset
      </Button>
      {isVaultFull ? (
        <div className="flex-1">
          <ProFeatureGate featureName="Unlimited Saved Inventory (Vault)" fallback={
            <Button 
              variant="primary" 
              className="w-full gap-2 border-none bg-gold hover:bg-gold-dark text-forest-black" 
              disabled={!output || isSaving}
            >
              <Lock className="w-4 h-4" /> Vault Full <PremiumBadge className="ml-1" />
            </Button>
          }>
            <div />
          </ProFeatureGate>
        </div>
      ) : (
        <Button 
          variant="primary" 
          className="flex-1 gap-2 border-none bg-bright-lime-dark hover:bg-bright-lime text-white" 
          onClick={handleSave}
          disabled={!output || isSaving}
        >
          <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Valuation'}
        </Button>
      )}
    </div>
  );
};
