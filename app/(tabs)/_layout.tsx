import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/ThemeContext';

export default function TabLayout() {
  const { theme } = useAppTheme();
  const colors = Colors[theme];
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('catalog'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-products"
        options={{
          title: t('my_products'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
