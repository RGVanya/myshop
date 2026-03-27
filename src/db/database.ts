import { DatabaseService } from '../services/DatabaseService';

export const initDatabase = () => DatabaseService.init();
export const addProduct = DatabaseService.addProduct.bind(DatabaseService);
export const updateProduct = DatabaseService.updateProduct.bind(DatabaseService);
export const getProducts = () => DatabaseService.getProducts();
export const deleteProduct = DatabaseService.deleteProduct.bind(DatabaseService);
