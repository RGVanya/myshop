import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProducts, deleteProduct } from '../../src/db/database';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  // Авто-обновление списка при каждом входе на экран
  useFocusEffect(
    useCallback(() => {
      setProducts(getProducts());
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">{t('welcome')}</ThemedText>
        <TouchableOpacity onPress={() => router.push('/settings' as any)}>
          <ThemedText type="link">{t('settings')}</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.thumbnail} contentFit="cover" />
            ) : (
              <View style={[styles.thumbnail, styles.placeholder]}><ThemedText style={{ fontSize: 8 }}>No Photo</ThemedText></View>
            )}

            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => router.push({ pathname: '/details', params: item as any })}
            >
              <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.title}</ThemedText>
              <ThemedText style={styles.priceText}>{(item.price / 100).toFixed(2)} ₽</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { deleteProduct(item.id); setProducts(getProducts()); }}>
              <ThemedText style={{ color: 'red' }}>✕</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText style={styles.empty}>{t('empty_list') || 'No products yet'}</ThemedText>}
      />

      {/* КНОПКА ДОБАВЛЕНИЯ (Floating Action Button) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-product' as any)}
      >
        <ThemedText style={styles.fabText}>+</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  card: { flexDirection: 'row', padding: 10, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(150,150,150,0.2)', alignItems: 'center' },
  thumbnail: { width: 50, height: 50, borderRadius: 8, backgroundColor: 'rgba(150,150,150,0.1)' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 12 },
  priceText: { color: '#0a7ea4', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, opacity: 0.5 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold' }
});