import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';
import { ValuationRecord } from '../types/valuation';

interface AppState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  unlockPremium: () => void;
  
  // LocalStorage for transient state
  currentInput: Partial<ValuationRecord>;
  updateInput: (input: Partial<ValuationRecord>) => void;
  clearInput: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      unlockPremium: () => set((state) => ({ settings: { ...state.settings, premiumUnlocked: true } })),
      
      currentInput: {
        strategy: 'balanced',
        urgency: 'normal',
        condition: 'good',
        ageBand: '1-3',
        brandTier: 'tierB',
      },
      updateInput: (input) => set((state) => ({ currentInput: { ...state.currentInput, ...input } })),
      clearInput: () => set({ currentInput: { strategy: 'balanced', urgency: 'normal', condition: 'good', ageBand: '1-3', brandTier: 'tierB' } }),
    }),
    {
      name: 'listinglens-storage',
      partialize: (state) => ({ settings: state.settings, currentInput: state.currentInput }),
    }
  )
);
