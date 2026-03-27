import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { useSettingsViewModel } from '@/src/viewmodels/useSettingsViewModel';

export default function SettingsScreen() {
  const { theme } = useAppTheme();
  const colors = Colors[theme];
  const vm = useSettingsViewModel();

  const networkColor =
    vm.networkStatus === 'online'
      ? colors.success
      : vm.networkStatus === 'offline'
      ? colors.danger
      : colors.warning;

  const networkLabel =
    vm.networkStatus === 'online'
      ? vm.t('online')
      : vm.networkStatus === 'offline'
      ? vm.t('offline')
      : vm.t('unknown');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, Shadows.sm]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(99,102,241,0.1)' }]}>
                <Ionicons name="moon-outline" size={20} color="#6366F1" />
              </View>
              <ThemedText style={[styles.rowLabel, { color: colors.text }]}>
                {vm.t('dark_mode')}
              </ThemedText>
            </View>
            <Switch
              value={vm.isDark}
              onValueChange={vm.toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, Shadows.sm]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
              <Ionicons name="language-outline" size={20} color="#3B82F6" />
            </View>
            <ThemedText style={[styles.rowLabel, { color: colors.text }]}>
              {vm.t('language')}
            </ThemedText>
          </View>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[
                styles.langButton,
                {
                  borderColor: vm.currentLanguage === 'ru' ? colors.primary : colors.border,
                  backgroundColor: vm.currentLanguage === 'ru' ? `${colors.primary}15` : 'transparent',
                },
              ]}
              onPress={() => vm.changeLanguage('ru')}
            >
              <ThemedText style={styles.langFlag}>🇷🇺</ThemedText>
              <ThemedText style={[styles.langLabel, { color: colors.text }]}>Русский</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langButton,
                {
                  borderColor: vm.currentLanguage === 'en' ? colors.primary : colors.border,
                  backgroundColor: vm.currentLanguage === 'en' ? `${colors.primary}15` : 'transparent',
                },
              ]}
              onPress={() => vm.changeLanguage('en')}
            >
              <ThemedText style={styles.langFlag}>🇺🇸</ThemedText>
              <ThemedText style={[styles.langLabel, { color: colors.text }]}>English</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, Shadows.sm]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: `${networkColor}20` }]}>
                <Ionicons
                  name={vm.isOnline ? 'wifi' : 'cloud-offline-outline'}
                  size={20}
                  color={networkColor}
                />
              </View>
              <View>
                <ThemedText style={[styles.rowLabel, { color: colors.text }]}>
                  {vm.t('network_status')}
                </ThemedText>
                <ThemedText style={[styles.networkStatus, { color: networkColor }]}>
                  {networkLabel}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, Shadows.sm]}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              vm.clearCache();
              Alert.alert(vm.t('cache_cleared'));
            }}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </View>
              <ThemedText style={[styles.rowLabel, { color: colors.text }]}>
                {vm.t('clear_cache')}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 12,
  },
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  networkStatus: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  langRow: {
    flexDirection: 'row',
    gap: 12,
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderWidth: 2,
    borderRadius: BorderRadius.md,
  },
  langFlag: {
    fontSize: 20,
  },
  langLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
