import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    background: '#F0F4F8',
    surface: '#FFFFFF',
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    accent: '#F97316',
    accentLight: 'rgba(249, 115, 22, 0.1)',
    success: '#22C55E',
    danger: '#EF4444',
    dangerLight: 'rgba(239, 68, 68, 0.1)',
    warning: '#EAB308',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    tint: '#2563EB',
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#2563EB',
    tabBar: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: 'rgba(0,0,0,0.06)',
    inputBackground: '#F8FAFC',
    inputBorder: '#E2E8F0',
    skeleton: '#E2E8F0',
    overlay: 'rgba(0,0,0,0.5)',
    badge: '#2563EB',
    ratingStars: '#F59E0B',
    discountBadge: '#EF4444',
    priceCurrent: '#0F172A',
    priceOld: '#94A3B8',
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    accent: '#FB923C',
    accentLight: 'rgba(251, 146, 60, 0.15)',
    success: '#4ADE80',
    danger: '#F87171',
    dangerLight: 'rgba(248, 113, 113, 0.15)',
    warning: '#FACC15',
    border: '#334155',
    borderLight: '#1E293B',
    tint: '#3B82F6',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: '#3B82F6',
    tabBar: '#1E293B',
    card: '#1E293B',
    cardBorder: 'rgba(255,255,255,0.06)',
    inputBackground: '#0F172A',
    inputBorder: '#334155',
    skeleton: '#334155',
    overlay: 'rgba(0,0,0,0.7)',
    badge: '#3B82F6',
    ratingStars: '#F59E0B',
    discountBadge: '#EF4444',
    priceCurrent: '#F1F5F9',
    priceOld: '#64748B',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const API_BASE_URL = 'https://dummyjson.com';

export const ELECTRONICS_CATEGORIES = [
  'smartphones',
  'laptops',
  'tablets',
  'mobile-accessories',
] as const;

export type ElectronicsCategory = (typeof ELECTRONICS_CATEGORIES)[number];

export const CACHE_MAX_AGE_MS = 30 * 60 * 1000;
