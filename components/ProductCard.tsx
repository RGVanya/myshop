import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import type { LocalProduct } from '@/src/models/types';

interface ProductCardProps {
  product: LocalProduct;
  onPress: () => void;
  onDelete: () => void;
}

export function ProductCard({ product, onPress, onDelete }: ProductCardProps) {
  const { theme } = useAppTheme();
  const colors = Colors[theme];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, Shadows.sm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {product.imageUri ? (
        <Image source={{ uri: product.imageUri }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: colors.inputBackground }]}>
          <Ionicons name="image-outline" size={28} color={colors.textSecondary} />
        </View>
      )}

      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {product.title}
        </ThemedText>
        {product.description ? (
          <ThemedText style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={1}>
            {product.description}
          </ThemedText>
        ) : null}
        <ThemedText style={[styles.price, { color: colors.accent }]}>
          {(product.price / 100).toFixed(2)} ₽
        </ThemedText>
      </View>

      <TouchableOpacity
        style={[styles.deleteBtn, { backgroundColor: colors.dangerLight }]}
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 14,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  desc: {
    fontSize: 13,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
