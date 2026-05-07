import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { File } from 'expo-file-system';

import { getFirebaseApp, isFirebaseConfigured } from '../config/firebase';
import type { ListedProduct } from '../models/types';

const COLLECTION = 'myshop_products';

/** Лимит Firestore ~1 MiB на документ; data URL крупнее — сохранение отклоним. */
const MAX_IMAGE_DATA_URL_CHARS = 850_000;

function tsToIso(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value) {
    const fn = (value as { toDate?: () => Date }).toDate;
    if (typeof fn === 'function') {
      try {
        return fn.call(value).toISOString();
      } catch {
        /* fallthrough */
      }
    }
  }
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

async function localUriToDataUrl(uri: string): Promise<string> {
  const file = new File(uri);
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const ext = file.extension?.toLowerCase() ?? '';
  const mime =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

async function resolveImageForFirestore(imageUri: string | null): Promise<string | null> {
  if (!imageUri) return null;
  if (imageUri.startsWith('http') || imageUri.startsWith('data:')) {
    return imageUri;
  }
  const dataUrl = await localUriToDataUrl(imageUri);
  if (dataUrl.length > MAX_IMAGE_DATA_URL_CHARS) {
    throw new Error(
      'IMAGE_TOO_LARGE: выберите фото меньше или снимите обрезку — лимит Firestore ~1 МБ на документ.'
    );
  }
  return dataUrl;
}

export const FirebaseProductService = {
  isConfigured: isFirebaseConfigured,

  async listProducts(): Promise<ListedProduct[]> {
    const db = getFirestore(getFirebaseApp());
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      const raw =
        data.imageUrl != null
          ? String(data.imageUrl)
          : data.imageDataUrl != null
            ? String(data.imageDataUrl)
            : null;
      return {
        listKey: d.id,
        backend: 'firestore' as const,
        firestoreId: d.id,
        title: String(data.title ?? ''),
        description: String(data.description ?? ''),
        price: Number(data.price ?? 0),
        imageUri: raw,
        createdAt: tsToIso(data.createdAt),
      };
    });
  },

  async upsert(opts: {
    firestoreId?: string;
    title: string;
    description: string;
    price: number;
    imageUri: string | null;
  }): Promise<void> {
    const db = getFirestore(getFirebaseApp());
    const colRef = collection(db, COLLECTION);
    const docRef = opts.firestoreId ? doc(db, COLLECTION, opts.firestoreId) : doc(colRef);

    const imageUrl = await resolveImageForFirestore(opts.imageUri);

    if (opts.firestoreId) {
      await updateDoc(docRef, {
        title: opts.title,
        description: opts.description,
        price: opts.price,
        imageUrl,
        updatedAt: serverTimestamp(),
      });
      return;
    }

    await setDoc(docRef, {
      title: opts.title,
      description: opts.description,
      price: opts.price,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async deleteProduct(firestoreId: string): Promise<void> {
    const db = getFirestore(getFirebaseApp());
    await deleteDoc(doc(db, COLLECTION, firestoreId));
  },
};
