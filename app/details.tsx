import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { updateProduct } from '../src/db/database';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

export default function DetailsScreen() {
    const item = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();


    const [title, setTitle] = useState(item.title as string);
    const [desc, setDesc] = useState(item.description as string);
    const [price, setPrice] = useState((Number(item.price) / 100).toString());
    const [image, setImage] = useState<string | null>(item.imageUri as string || null);

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

    const handleUpdate = () => {
        const priceInCents = Math.round(parseFloat(price.replace(',', '.')) * 100);
        updateProduct(Number(item.id), title, desc, priceInCents, image);
        router.back();
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedText type="title">{t('details')}</ThemedText>

                {/* Выбор/смена картинки */}
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <ThemedText>+ {t('add_photo') || 'Add Photo'}</ThemedText>
                    )}
                </TouchableOpacity>

                <View style={styles.editForm}>
                    <ThemedText>{t('name_label')}:</ThemedText>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor="#888" />

                    <ThemedText>{t('desc_label')}:</ThemedText>
                    <TextInput style={styles.input} value={desc} onChangeText={setDesc} placeholderTextColor="#888" />

                    <ThemedText>{t('price_label')}:</ThemedText>
                    <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholderTextColor="#888" />

                    <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                        <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>OK / SAVE</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 20 },
    imagePicker: {
        height: 200,
        backgroundColor: 'rgba(150,150,150,0.1)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed'
    },
    previewImage: { width: '100%', height: '100%' },
    editForm: { marginTop: 10 },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#0a7ea4',
        marginBottom: 20,
        fontSize: 18,
        padding: 8,
        color: '#888'
    },
    saveBtn: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20
    }
});