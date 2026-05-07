import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { DatabaseService } from '../services/DatabaseService';
import { FirebaseProductService } from '../services/FirebaseProductService';

interface InitialValues {
  backend?: 'sqlite' | 'firestore';
  sqliteRowId?: number;
  firestoreId?: string;
  title?: string;
  description?: string;
  price?: string;
  imageUri?: string | null;
}

export function useProductFormViewModel(initial: InitialValues = {}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [price, setPrice] = useState(initial.price ?? '');
  const [image, setImage] = useState<string | null>(initial.imageUri ?? null);
  const [saving, setSaving] = useState(false);

  const isEdit = initial.sqliteRowId != null || Boolean(initial.firestoreId);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validate = (t: (key: string) => string): boolean => {
    if (!title.trim() || !price.trim()) {
      Alert.alert(t('error') || 'Error', t('fill_required') || 'Fill required fields');
      return false;
    }
    const parsed = parseFloat(price.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert(t('error') || 'Error', t('invalid_price') || 'Invalid price');
      return false;
    }
    return true;
  };

  const save = async (t: (key: string) => string) => {
    if (!validate(t)) return;
    setSaving(true);
    const priceInCents = Math.round(parseFloat(price.replace(',', '.')) * 100);

    try {
      const cloud = FirebaseProductService.isConfigured();

      if (cloud) {
        if (initial.firestoreId) {
          await FirebaseProductService.upsert({
            firestoreId: initial.firestoreId,
            title: title.trim(),
            description: description.trim(),
            price: priceInCents,
            imageUri: image,
          });
        } else if (initial.sqliteRowId != null) {
          DatabaseService.updateProduct(
            initial.sqliteRowId,
            title.trim(),
            description.trim(),
            priceInCents,
            image
          );
        } else {
          await FirebaseProductService.upsert({
            title: title.trim(),
            description: description.trim(),
            price: priceInCents,
            imageUri: image,
          });
        }
      } else if (initial.sqliteRowId != null) {
        DatabaseService.updateProduct(
          initial.sqliteRowId,
          title.trim(),
          description.trim(),
          priceInCents,
          image
        );
      } else {
        DatabaseService.addProduct(title.trim(), description.trim(), priceInCents, image);
      }

      router.back();
    } catch (e) {
      console.warn(e);
      const msg = e instanceof Error ? e.message : '';
      const body =
        msg.includes('IMAGE_TOO_LARGE') ? t('image_too_large_firestore') : t('save_cloud_error');
      Alert.alert(t('error') || 'Error', body || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    image,
    pickImage,
    save,
    saving,
    isEdit,
  };
}
