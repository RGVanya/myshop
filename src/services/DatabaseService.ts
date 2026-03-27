import * as SQLite from 'expo-sqlite';
import type { LocalProduct } from '../models/types';

const db = SQLite.openDatabaseSync('electronicsStore.db');

export const DatabaseService = {
  init() {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price INTEGER,
        imageUri TEXT,
        createdAt TEXT
      );
    `);
    db.execSync(`
      CREATE TABLE IF NOT EXISTS api_cache (
        id INTEGER PRIMARY KEY,
        category TEXT NOT NULL,
        data TEXT NOT NULL,
        cachedAt TEXT NOT NULL
      );
    `);
    db.execSync(`
      CREATE TABLE IF NOT EXISTS cache_meta (
        category TEXT PRIMARY KEY,
        cachedAt TEXT NOT NULL
      );
    `);
  },

  addProduct(title: string, description: string, price: number, imageUri: string | null) {
    const createdAt = new Date().toISOString();
    db.runSync(
      'INSERT INTO products (title, description, price, imageUri, createdAt) VALUES (?, ?, ?, ?, ?)',
      [title, description, price, imageUri, createdAt]
    );
  },

  updateProduct(id: number, title: string, description: string, price: number, imageUri: string | null) {
    db.runSync(
      'UPDATE products SET title = ?, description = ?, price = ?, imageUri = ? WHERE id = ?',
      [title, description, price, imageUri, id]
    );
  },

  getProducts(): LocalProduct[] {
    return db.getAllSync('SELECT * FROM products ORDER BY id DESC') as LocalProduct[];
  },

  deleteProduct(id: number) {
    db.runSync('DELETE FROM products WHERE id = ?', [id]);
  },
};
