import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';


import { CustomThemeProvider, useAppTheme } from '@/hooks/ThemeContext';
import { initDatabase } from '../src/db/database';
import '../i18n/i18n';
import { useTranslation } from 'react-i18next';


SplashScreen.preventAutoHideAsync().catch(() => { });

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {

        initDatabase();


        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn("Ошибка инициализации:", e);
      } finally {

        setAppIsReady(true);
      }
    }

    prepare();
  }, []);


  if (!appIsReady) {
    return null;
  }

  return (
    <CustomThemeProvider>
      <View style={{ flex: 1 }} onLayout={() => SplashScreen.hideAsync()}>
        <RootLayoutNav />
      </View>
    </CustomThemeProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: t('settings_title') || 'Settings' }} />
        <Stack.Screen name="details" options={{ title: t('details') || 'Details' }} />
        <Stack.Screen name="add-product" options={{ title: t('add_product') }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}