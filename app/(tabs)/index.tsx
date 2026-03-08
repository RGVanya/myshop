import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
// Импортируем иконки (они уже встроены в Expo)
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/ThemeContext';
import { deleteProduct, getProducts } from '../../src/db/database';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useAppTheme(); // 'light' или 'dark'

  // Безопасно получаем цвета. Если Colors[theme] не сработает, возьмем пустой объект
  const activeColors = Colors[theme] || {};

  const [products, setProducts] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      setProducts(getProducts());
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <View style={styles.headerRow}>
        <ThemedText type="title" style={styles.welcomeText}>{t('welcome')}</ThemedText>

        {/* КНОПКА НАСТРОЕК (Иконка вместо текста) */}
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme === 'dark' ? '#333' : '#eee' }]}
          onPress={() => router.push('/settings' as any)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={theme === 'dark' ? '#fff' : '#333'}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.thumbnail} contentFit="cover" />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="image-outline" size={20} color="#ccc" />
              </View>
            )}

            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => router.push({ pathname: '/details', params: item as any })}
            >
              <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.title}</ThemedText>
              <ThemedText style={styles.priceText}>{(item.price / 100).toFixed(2)} ₽</ThemedText>
            </TouchableOpacity>

            {/* Иконка корзины вместо текста "Удалить" */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => { deleteProduct(item.id); setProducts(getProducts()); }}
            >
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText style={styles.empty}>{t('empty_list') || 'No products yet'}</ThemedText>}
      />

      {/* FAB КНОПКА С ИКОНКОЙ + */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-product' as any)}
      >
        <Ionicons name="add" size={35} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25
  },
  welcomeText: {
    fontSize: 28,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22, // Делаем кнопку круглой
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.15)',
    alignItems: 'center'
  },
  thumbnail: {
    width: 55,
    height: 55,
    borderRadius: 10
  },
  placeholder: {
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: 'rgba(150,150,150,0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContent: {
    flex: 1,
    marginLeft: 15
  },
  priceText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2
  },
  deleteBtn: {
    padding: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 80,
    opacity: 0.5,
    fontSize: 16
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: { color: '#fff', fontSize: 35, fontWeight: 'bold' }
});