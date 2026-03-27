import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/hooks/ThemeContext';
import { useNetwork } from '../context/NetworkContext';
import { CacheService } from '../services/CacheService';

export function useSettingsViewModel() {
  const { theme, toggleTheme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const { status, isOnline } = useNetwork();

  const isDark = theme === 'dark';
  const currentLanguage = i18n.language?.includes('ru') ? 'ru' : 'en';

  const changeLanguage = useCallback(
    async (lang: string) => {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('user-language', lang);
    },
    [i18n]
  );

  const clearCache = useCallback(() => {
    CacheService.clearAll();
  }, []);

  return {
    theme,
    isDark,
    toggleTheme,
    currentLanguage,
    changeLanguage,
    networkStatus: status,
    isOnline,
    clearCache,
    t,
  };
}
