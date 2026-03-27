import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { NetworkBanner } from '@/components/NetworkBanner';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CatalogCard } from '@/components/CatalogCard';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors } from '@/constants/theme';
import { useCatalogViewModel } from '@/src/viewmodels/useCatalogViewModel';
import type { ElectronicsCategory } from '@/constants/theme';

export default function CatalogScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const vm = useCatalogViewModel();

  const categories: { key: ElectronicsCategory | 'all'; label: string }[] = [
    { key: 'all', label: t('all_categories') },
    { key: 'smartphones', label: t('smartphones') },
    { key: 'laptops', label: t('laptops') },
    { key: 'tablets', label: t('tablets') },
    { key: 'mobile-accessories', label: t('accessories') },
  ];

  const renderHeader = () => (
    <View>
      <SearchBar
        value={vm.searchQuery}
        onChangeText={vm.onSearch}
        placeholder={t('search_placeholder')}
      />
      <CategoryFilter
        selected={vm.category}
        onSelect={vm.onCategoryChange}
        categories={categories}
      />
      {vm.isFromCache && (
        <View style={[styles.cacheBadge, { backgroundColor: colors.accentLight }]}>
          <Ionicons name="cloud-offline-outline" size={14} color={colors.accent} />
          <ThemedText style={[styles.cacheBadgeText, { color: colors.accent }]}>
            {t('offline_data')}
          </ThemedText>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (vm.loading) return null;

    if (vm.error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} />
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('load_error')}
          </ThemedText>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={vm.retry}
          >
            <ThemedText style={styles.retryText}>{t('retry')}</ThemedText>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
        <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
          {t('empty_list')}
        </ThemedText>
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <NetworkBanner />

      <View style={styles.header}>
        <ThemedText style={[styles.appName, { color: colors.text }]}>
          {t('app_name')}
        </ThemedText>
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/settings' as any)}
        >
          <Ionicons name="settings-outline" size={22} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {vm.loading && !vm.refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('loading')}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={vm.products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={vm.refreshing}
              onRefresh={vm.onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <CatalogCard
                product={item}
                onPress={() =>
                  router.push({
                    pathname: '/catalog-detail',
                    params: { id: item.id.toString() },
                  } as any)
                }
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  cacheBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  cacheBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
});
