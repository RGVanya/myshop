import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('electronicsStore.db');

export const initDatabase = () => {
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

};

export const addProduct = (title: string, description: string, price: number, imageUri: string | null) => {
    const createdAt = new Date().toISOString();
    db.runSync(
        'INSERT INTO products (title, description, price, imageUri, createdAt) VALUES (?, ?, ?, ?, ?)',
        [title, description, price, imageUri, createdAt]
    );
};

export const updateProduct = (id: number, title: string, description: string, price: number, imageUri: string | null) => {
    db.runSync(
        'UPDATE products SET title = ?, description = ?, price = ?, imageUri = ? WHERE id = ?',
        [title, description, price, imageUri, id]
    );
};

export const getProducts = () => db.getAllSync('SELECT * FROM products ORDER BY id DESC');
export const deleteProduct = (id: number) => db.runSync('DELETE FROM products WHERE id = ?', [id]);