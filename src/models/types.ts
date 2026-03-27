export interface LocalProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUri: string | null;
  createdAt: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  availabilityStatus?: string;
}

export interface ApiProductsResponse {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

export type NetworkStatus = 'online' | 'offline' | 'unknown';

export interface CachedData<T> {
  data: T;
  cachedAt: string;
  isStale: boolean;
}
