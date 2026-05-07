import { useCallback, useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { ApiService } from '../services/ApiService';
import { CacheService } from '../services/CacheService';
import { useNetwork } from '../context/NetworkContext';
import type { ApiProduct } from '../models/types';
import type { ElectronicsCategory } from '@/constants/theme';

export type CatalogSortId = 'default' | 'price_asc' | 'price_desc' | 'rating_desc' | 'title';

function sortCatalog(list: ApiProduct[], sortBy: CatalogSortId): ApiProduct[] {
  const next = [...list];
  switch (sortBy) {
    case 'price_asc':
      return next.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return next.sort((a, b) => b.price - a.price);
    case 'rating_desc':
      return next.sort((a, b) => b.rating - a.rating);
    case 'title':
      return next.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    case 'default':
    default:
      return next;
  }
}

export function useCatalogViewModel() {
  const { isOnline } = useNetwork();
  const [rawProducts, setRawProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<ElectronicsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<CatalogSortId>('default');
  const [isFromCache, setIsFromCache] = useState(false);

  const loadProducts = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);
      setError(null);

      try {
        let data: ApiProduct[];

        if (category === 'all') {
          data = await ApiService.fetchAllElectronics();
        } else {
          const res = await ApiService.fetchProductsByCategory(category);
          data = res.products;
        }

        setRawProducts(data);
        setIsFromCache(false);

        const cacheKey = category === 'all' ? 'all' : category;
        CacheService.saveProducts(data, cacheKey);
      } catch {
        const cacheKey = category === 'all' ? 'all' : category;
        const cached =
          cacheKey === 'all' ? CacheService.getAllProducts() : CacheService.getProducts(cacheKey);

        if (cached.length > 0) {
          setRawProducts(cached);
          setIsFromCache(true);
        } else {
          setError('load_error');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const fuse = useMemo(
    () =>
      new Fuse(rawProducts, {
        keys: ['title', 'description', 'brand', 'category'],
        threshold: 0.38,
        ignoreLocation: true,
      }),
    [rawProducts]
  );

  const products = useMemo(() => {
    const q = searchQuery.trim();
    const matched = q ? fuse.search(q).map((r) => r.item) : rawProducts;
    return sortCatalog(matched, sortBy);
  }, [rawProducts, searchQuery, fuse, sortBy]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts(false);
  }, [loadProducts]);

  const onCategoryChange = useCallback((cat: ElectronicsCategory | 'all') => {
    setCategory(cat);
    setSearchQuery('');
  }, []);

  return {
    products,
    loading,
    refreshing,
    error,
    category,
    searchQuery,
    sortBy,
    setSortBy,
    isFromCache,
    isOnline,
    onRefresh,
    onSearch: setSearchQuery,
    onCategoryChange,
    retry: () => loadProducts(),
  };
}
