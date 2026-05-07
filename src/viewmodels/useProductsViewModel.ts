import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import Fuse from 'fuse.js';
import { useFocusEffect } from 'expo-router';
import { DatabaseService } from '../services/DatabaseService';
import { FirebaseProductService } from '../services/FirebaseProductService';
import type { ListedProduct, LocalProduct } from '../models/types';

export type MyProductsSortId = 'created_desc' | 'price_asc' | 'price_desc' | 'title';

function fromLocal(p: LocalProduct): ListedProduct {
  return {
    listKey: `local_${p.id}`,
    backend: 'sqlite',
    sqliteRowId: p.id,
    title: p.title,
    description: p.description ?? '',
    price: p.price,
    imageUri: p.imageUri,
    createdAt: p.createdAt,
  };
}

function sortListed(list: ListedProduct[], sortBy: MyProductsSortId): ListedProduct[] {
  const next = [...list];
  switch (sortBy) {
    case 'price_asc':
      return next.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return next.sort((a, b) => b.price - a.price);
    case 'title':
      return next.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    case 'created_desc':
    default:
      return next.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
}

export function useProductsViewModel() {
  const [rawProducts, setRawProducts] = useState<ListedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<MyProductsSortId>('created_desc');

  const loadProducts = useCallback(async () => {
    try {
      if (FirebaseProductService.isConfigured()) {
        const cloud = await FirebaseProductService.listProducts();
        setRawProducts(cloud);
      } else {
        setRawProducts(DatabaseService.getProducts().map(fromLocal));
      }
    } catch (e) {
      console.warn(e);
      setRawProducts(DatabaseService.getProducts().map(fromLocal));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProducts();
    }, [loadProducts])
  );

  const fuse = useMemo(
    () =>
      new Fuse(rawProducts, {
        keys: ['title', 'description'],
        threshold: 0.42,
        ignoreLocation: true,
      }),
    [rawProducts]
  );

  const products = useMemo(() => {
    const q = searchQuery.trim();
    const matched = q ? fuse.search(q).map((r) => r.item) : rawProducts;
    return sortListed(matched, sortBy);
  }, [rawProducts, searchQuery, fuse, sortBy]);

  const confirmDelete = useCallback(
    (item: ListedProduct, t: (key: string) => string) => {
      Alert.alert(
        t('confirm_delete') || 'Confirm',
        `${t('delete_message') || 'Delete'} "${item.title}"?`,
        [
          { text: t('cancel') || 'Cancel', style: 'cancel' },
          {
            text: t('delete') || 'Delete',
            style: 'destructive',
            onPress: () => {
              void (async () => {
                try {
                  if (item.backend === 'firestore' && item.firestoreId) {
                    await FirebaseProductService.deleteProduct(item.firestoreId);
                  } else if (item.sqliteRowId != null) {
                    DatabaseService.deleteProduct(item.sqliteRowId);
                  }
                  await loadProducts();
                } catch (e) {
                  console.warn(e);
                  Alert.alert(t('error') || 'Error', t('delete_cloud_error') || 'Could not delete');
                }
              })();
            },
          },
        ]
      );
    },
    [loadProducts]
  );

  return {
    products,
    allCount: rawProducts.length,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    deleteProduct: confirmDelete,
    refresh: loadProducts,
    usesCloud: FirebaseProductService.isConfigured(),
  };
}
