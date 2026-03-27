import { API_BASE_URL } from '@/constants/theme';
import type { ApiProduct, ApiProductsResponse } from '../models/types';

export const ApiService = {
  async fetchProductsByCategory(category: string, limit = 30, skip = 0): Promise<ApiProductsResponse> {
    const url = `${API_BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  async fetchAllElectronics(limit = 30, skip = 0): Promise<ApiProduct[]> {
    const categories = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];
    const promises = categories.map((cat) =>
      this.fetchProductsByCategory(cat, limit, skip)
        .then((res) => res.products)
        .catch(() => [] as ApiProduct[])
    );
    const results = await Promise.all(promises);
    return results.flat();
  },

  async searchProducts(query: string, limit = 30): Promise<ApiProductsResponse> {
    const url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  async fetchProductById(id: number): Promise<ApiProduct> {
    const url = `${API_BASE_URL}/products/${id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
};
