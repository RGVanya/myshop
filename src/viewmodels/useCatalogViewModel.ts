import { useCallback, useEffect, useState } from 'react';
import { ApiService } from '../services/ApiService';
import { CacheService } from '../services/CacheService';
import { useNetwork } from '../context/NetworkContext';
import type { ApiProduct } from '../models/types';
import type { ElectronicsCategory } from '@/constants/theme';

export function useCatalogViewModel() {
  const { isOnline } = useNetwork();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<ElectronicsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFromCache, setIsFromCache] = useState(false);
  const loadProducts = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);
      setError(null);

      try {
        let data: ApiProduct[];

        if (searchQuery.trim()) {
          const res = await ApiService.searchProducts(searchQuery.trim());
          data = res.products.filter((p) =>
            ['smartphones', 'laptops', 'tablets', 'mobile-accessories'].includes(p.category)
          );
        } else if (category === 'all') {
          data = await ApiService.fetchAllElectronics();
        } else {
          const res = await ApiService.fetchProductsByCategory(category);
          data = res.products;
        }

        setProducts(data);
        setIsFromCache(false);

        const cacheKey = searchQuery.trim() || category;
        CacheService.saveProducts(data, cacheKey);
      } catch {
        const cacheKey = searchQuery.trim() || category;
        const cached = cacheKey === 'all'
          ? CacheService.getAllProducts()
          : CacheService.getProducts(cacheKey);

        if (cached.length > 0) {
          setProducts(cached);
          setIsFromCache(true);
        } else {
          setError('load_error');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, searchQuery]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
    isFromCache,
    isOnline,
    onRefresh,
    onSearch: setSearchQuery,
    onCategoryChange,
    retry: () => loadProducts(),
  };
}
