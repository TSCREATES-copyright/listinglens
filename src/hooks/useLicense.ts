import { useAppStore } from '../state/appStore';
import { validateLicenseKey } from '../systems/licenseKeys';

export const useLicense = () => {
  const { settings, unlockPremium } = useAppStore();
  
  const isPro = settings.premiumUnlocked;

  const activateLicense = (key: string): boolean => {
    if (validateLicenseKey(key)) {
      unlockPremium();
      return true;
    }
    return false;
  };

  return {
    isPro,
    activateLicense
  };
};
