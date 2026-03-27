export type AppSettings = {
  premiumUnlocked: boolean;
  defaultStrategy: 'profit' | 'balanced' | 'speed';
  preferredCurrency: 'USD';
  tutorialCompleted: boolean;
  compactMode: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  premiumUnlocked: false,
  defaultStrategy: 'balanced',
  preferredCurrency: 'USD',
  tutorialCompleted: false,
  compactMode: false,
};
