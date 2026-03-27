import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { DatabaseService } from '../services/DatabaseService';
import type { LocalProduct } from '../models/types';

export function useProductsViewModel() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = useCallback(() => {
    setProducts(DatabaseService.getProducts());
  }, []);

  useFocusEffect(loadProducts);

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const confirmDelete = useCallback(
    (id: number, title: string, t: (key: string) => string) => {
      Alert.alert(
        t('confirm_delete') || 'Confirm',
        `${t('delete_message') || 'Delete'} "${title}"?`,
        [
          { text: t('cancel') || 'Cancel', style: 'cancel' },
          {
            text: t('delete') || 'Delete',
            style: 'destructive',
            onPress: () => {
              DatabaseService.deleteProduct(id);
              loadProducts();
            },
          },
        ]
      );
    },
    [loadProducts]
  );

  return {
    products: filteredProducts,
    allCount: products.length,
    searchQuery,
    setSearchQuery,
    deleteProduct: confirmDelete,
    refresh: loadProducts,
  };
}
