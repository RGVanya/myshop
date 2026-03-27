import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { DatabaseService } from '../services/DatabaseService';

interface InitialValues {
  id?: number;
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

  const isEdit = initial.id != null;

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

  const save = (t: (key: string) => string) => {
    if (!validate(t)) return;
    setSaving(true);
    const priceInCents = Math.round(parseFloat(price.replace(',', '.')) * 100);

    if (isEdit && initial.id != null) {
      DatabaseService.updateProduct(initial.id, title.trim(), description.trim(), priceInCents, image);
    } else {
      DatabaseService.addProduct(title.trim(), description.trim(), priceInCents, image);
    }

    setSaving(false);
    router.back();
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
