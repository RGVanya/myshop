import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CustomThemeProvider, useAppTheme } from '@/hooks/ThemeContext';
import { NetworkProvider } from '@/src/context/NetworkContext';
import { DatabaseService } from '@/src/services/DatabaseService';
import '../i18n/i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        DatabaseService.init();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Init error:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!appIsReady) return null;

  return (
    <CustomThemeProvider>
      <NetworkProvider>
        <View style={{ flex: 1 }} onLayout={() => SplashScreen.hideAsync()}>
          <RootLayoutNav />
        </View>
      </NetworkProvider>
    </CustomThemeProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const navTheme = theme === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#0F172A', card: '#1E293B', primary: '#3B82F6' } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#F0F4F8', card: '#FFFFFF', primary: '#2563EB' } };

  return (
    <ThemeProvider value={navTheme}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: t('settings_title'), presentation: 'card' }} />
        <Stack.Screen name="details" options={{ title: t('edit_product'), presentation: 'card' }} />
        <Stack.Screen name="add-product" options={{ title: t('add_product'), presentation: 'card' }} />
        <Stack.Screen name="catalog-detail" options={{ title: t('product_detail'), presentation: 'card' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
