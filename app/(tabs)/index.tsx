import React, { useState, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, View, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProducts, addProduct, deleteProduct } from '../../src/db/database';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();


  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);


  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const loadData = () => {
    const data = getProducts();
    setProducts(data);
  };


  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAdd = () => {
    if (!title || !price) return;
    const priceInCents = Math.round(parseFloat(price) * 100);


    addProduct(title, desc, priceInCents, image);

    setTitle(''); setDesc(''); setPrice(''); setImage(null);
    loadData();
  };

  return (
    <ThemedView style={styles.container}>

      {/* ВЕРХНЯЯ ПАНЕЛЬ С КНОПКОЙ НАСТРОЕК */}
      <View style={styles.headerRow}>
        <ThemedText type="title">{t('welcome')}</ThemedText>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/settings' as any)}
        >
          <ThemedText type="link">{t('settings')}</ThemedText>
        </TouchableOpacity>
      </View>

      {/* ФОРМА ДОБАВЛЕНИЯ */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t('name_label')}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder={t('desc_label')}
          value={desc}
          onChangeText={setDesc}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder={t('price_label')}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <ThemedText>+ {t('add_photo')}</ThemedText>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <ThemedText style={{ color: '#fff' }}>{t('add_product')}</ThemedText>
        </TouchableOpacity>
      </View>

      {/* СПИСОК ТОВАРОВ (READ) */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            {/* 1. Картинка товара */}
            {item.imageUri ? (
              <Image
                source={{ uri: item.imageUri }}
                style={styles.thumbnail}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={[styles.thumbnail, styles.placeholder]}>
                <ThemedText style={{ fontSize: 10, textAlign: 'center' }}>No Photo</ThemedText>
              </View>
            )}

            {/* 2. Инфо о товаре (Кликабельная часть) */}
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => router.push({ pathname: '/details', params: item as any })}
            >
              <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.priceText}>
                {(item.price / 100).toFixed(2)} ₽
              </ThemedText>
              <ThemedText style={styles.dateText}>
                {item.createdAt?.split('T')[0]}
              </ThemedText>
            </TouchableOpacity>

            {/* 3. Кнопка удаления */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => { deleteProduct(item.id); loadData(); }}
            >
              <ThemedText style={{ color: 'red', fontWeight: 'bold' }}>{t('delete')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  settingsBtn: { padding: 5 },
  form: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(150,150,150,0.1)',
    marginBottom: 20
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    color: '#888'
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  card: {
    flexDirection: 'row', //элементы в ряд: картинка | текст | кнопка
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.1)',
    borderStyle: 'dashed',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  priceText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 10,
  },
  imagePicker: {
    height: 100,
    backgroundColor: 'rgba(150,150,150,0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden'
  },
  previewImage: { width: '100%', height: '100%' },
  cardThumb: { width: 50, height: 50, borderRadius: 6 },
});