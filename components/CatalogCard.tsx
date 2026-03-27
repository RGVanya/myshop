import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import type { ApiProduct } from '@/src/models/types';

interface CatalogCardProps {
  product: ApiProduct;
  onPress: () => void;
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('star');
    else if (i === full && half) stars.push('star-half');
    else stars.push('star-outline');
  }
  return (
    <View style={starStyles.container}>
      {stars.map((name, i) => (
        <Ionicons key={i} name={name as any} size={12} color="#F59E0B" />
      ))}
      <ThemedText style={starStyles.text}>{rating.toFixed(1)}</ThemedText>
    </View>
  );
}

const starStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  text: { fontSize: 11, marginLeft: 4, color: '#94A3B8' },
});

export function CatalogCard({ product, onPress }: CatalogCardProps) {
  const { theme } = useAppTheme();
  const colors = Colors[theme];
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, Shadows.md]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC' }]}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} contentFit="contain" />
        {product.discountPercentage > 5 && (
          <View style={styles.discountBadge}>
            <ThemedText style={styles.discountText}>-{Math.round(product.discountPercentage)}%</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.info}>
        {product.brand && (
          <ThemedText style={[styles.brand, { color: colors.primary }]} numberOfLines={1}>
            {product.brand}
          </ThemedText>
        )}
        <ThemedText style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {product.title}
        </ThemedText>
        <RatingStars rating={product.rating} />
        <View style={styles.priceRow}>
          <ThemedText style={[styles.price, { color: colors.accent }]}>
            ${discountedPrice.toFixed(0)}
          </ThemedText>
          {product.discountPercentage > 5 && (
            <ThemedText style={[styles.oldPrice, { color: colors.priceOld }]}>
              ${product.price}
            </ThemedText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  discountText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  info: {
    padding: 12,
    gap: 4,
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
  },
  oldPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
});
