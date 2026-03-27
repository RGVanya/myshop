import * as SQLite from 'expo-sqlite';
import type { ApiProduct } from '../models/types';
import { CACHE_MAX_AGE_MS } from '@/constants/theme';

const db = SQLite.openDatabaseSync('electronicsStore.db');

export const CacheService = {
  saveProducts(products: ApiProduct[], category: string) {
    const now = new Date().toISOString();
    db.runSync('DELETE FROM api_cache WHERE category = ?', [category]);
    for (const p of products) {
      db.runSync(
        'INSERT OR REPLACE INTO api_cache (id, category, data, cachedAt) VALUES (?, ?, ?, ?)',
        [p.id, category, JSON.stringify(p), now]
      );
    }
    db.runSync(
      'INSERT OR REPLACE INTO cache_meta (category, cachedAt) VALUES (?, ?)',
      [category, now]
    );
  },

  getProducts(category: string): ApiProduct[] {
    const rows = db.getAllSync(
      'SELECT data FROM api_cache WHERE category = ?',
      [category]
    ) as { data: string }[];
    return rows.map((r) => JSON.parse(r.data));
  },

  getAllProducts(): ApiProduct[] {
    const rows = db.getAllSync('SELECT data FROM api_cache') as { data: string }[];
    return rows.map((r) => JSON.parse(r.data));
  },

  isCacheStale(category: string): boolean {
    const rows = db.getAllSync(
      'SELECT cachedAt FROM cache_meta WHERE category = ?',
      [category]
    ) as { cachedAt: string }[];
    if (rows.length === 0) return true;
    const cachedTime = new Date(rows[0].cachedAt).getTime();
    return Date.now() - cachedTime > CACHE_MAX_AGE_MS;
  },

  clearAll() {
    db.runSync('DELETE FROM api_cache');
    db.runSync('DELETE FROM cache_meta');
  },
};
