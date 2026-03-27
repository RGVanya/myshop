import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useProductsViewModel } from '@/src/viewmodels/useProductsViewModel';

export default function MyProductsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const vm = useProductsViewModel();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            {t('my_products')}
          </ThemedText>
          {vm.allCount > 0 && (
            <ThemedText style={[styles.count, { color: colors.textSecondary }]}>
              {vm.allCount} {t('items')}
            </ThemedText>
          )}
        </View>
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/settings' as any)}
        >
          <Ionicons name="settings-outline" size={22} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {vm.allCount > 0 && (
          <SearchBar
            value={vm.searchQuery}
            onChangeText={vm.setSearchQuery}
            placeholder={t('search_my_products')}
          />
        )}

        <FlatList
          data={vm.products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push({ pathname: '/details', params: item as any })}
              onDelete={() => vm.deleteProduct(item.id, item.title, t)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
                <Ionicons name="bag-outline" size={48} color={colors.textSecondary} />
              </View>
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('empty_list')}
              </ThemedText>
            </View>
          }
        />
      </View>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }, Shadows.lg]}
        onPress={() => router.push('/add-product' as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  count: {
    fontSize: 13,
    marginTop: 2,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 16,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
