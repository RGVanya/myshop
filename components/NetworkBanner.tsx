import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useNetwork } from '@/src/context/NetworkContext';
import { useTranslation } from 'react-i18next';

export function NetworkBanner() {
  const { isOnline } = useNetwork();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color="#FFF" />
      <ThemedText style={styles.text}>{t('no_internet')}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
