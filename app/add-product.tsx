import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { addProduct } from '../src/db/database';

export default function AddProductScreen() {
    const { t } = useTranslation();
    const router = useRouter();

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

    const handleSave = () => {
        if (!title || !price) {
            Alert.alert(t('error') || 'Error', t('fill_fields') || 'Please fill name and price');
            return;
        }

        const priceInCents = Math.round(parseFloat(price.replace(',', '.')) * 100);
        addProduct(title, desc, priceInCents, image);

        // Возвращаемся назад после добавления
        router.back();
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedText type="title" style={styles.header}>{t('add_product')}</ThemedText>

                {/* Выбор фото */}
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <ThemedText>+ {t('add_photo') || 'Add Photo'}</ThemedText>
                    )}
                </TouchableOpacity>

                <View style={styles.form}>
                    <ThemedText>{t('name_label')}</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#888"
                    />

                    <ThemedText>{t('desc_label')}</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={desc}
                        onChangeText={setDesc}
                        placeholderTextColor="#888"
                    />

                    <ThemedText>{t('price_label')}</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholderTextColor="#888"
                    />

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <ThemedText style={styles.saveBtnText}>{t('add_product') || 'Save'}</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { marginBottom: 20 },
    imagePicker: {
        height: 200,
        backgroundColor: 'rgba(150,150,150,0.1)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed'
    },
    previewImage: { width: '100%', height: '100%' },
    form: { gap: 10 },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#0a7ea4',
        paddingVertical: 8,
        fontSize: 18,
        color: '#888',
        marginBottom: 15
    },
    saveBtn: {
        backgroundColor: '#0a7ea4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});