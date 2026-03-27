import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { ApiService } from '@/src/services/ApiService';
import { useNetwork } from '@/src/context/NetworkContext';
import type { ApiProduct } from '@/src/models/types';

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
    <View style={starStyles.row}>
      {stars.map((name, i) => (
        <Ionicons key={i} name={name as any} size={18} color="#F59E0B" />
      ))}
      <ThemedText style={starStyles.text}>{rating.toFixed(1)}</ThemedText>
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  text: { fontSize: 15, fontWeight: '700', marginLeft: 6, color: '#F59E0B' },
});

export default function CatalogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const colors = Colors[theme];
  const { isOnline } = useNetwork();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ApiService.fetchProductById(Number(id))
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <ThemedText style={{ color: colors.textSecondary, marginTop: 12 }}>
          {t('load_error')}
        </ThemedText>
      </View>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.imageContainer, { backgroundColor: theme === 'dark' ? '#1E293B' : '#F8FAFC' }]}>
        <Image
          source={{ uri: images[currentImageIndex] }}
          style={styles.mainImage}
          contentFit="contain"
        />
        {product.discountPercentage > 5 && (
          <View style={styles.discountBadge}>
            <ThemedText style={styles.discountText}>
              -{Math.round(product.discountPercentage)}%
            </ThemedText>
          </View>
        )}
      </View>

      {images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailRow}
        >
          {images.map((uri, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setCurrentImageIndex(idx)}
              style={[
                styles.thumbnailBtn,
                {
                  borderColor: idx === currentImageIndex ? colors.primary : colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Image source={{ uri }} style={styles.thumbnailImg} contentFit="contain" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.infoSection}>
        {product.brand && (
          <ThemedText style={[styles.brand, { color: colors.primary }]}>
            {product.brand}
          </ThemedText>
        )}

        <ThemedText style={[styles.title, { color: colors.text }]}>
          {product.title}
        </ThemedText>

        <RatingStars rating={product.rating} />

        <View style={styles.priceSection}>
          <ThemedText style={[styles.price, { color: colors.accent }]}>
            ${discountedPrice.toFixed(2)}
          </ThemedText>
          {product.discountPercentage > 5 && (
            <ThemedText style={[styles.oldPrice, { color: colors.priceOld }]}>
              ${product.price.toFixed(2)}
            </ThemedText>
          )}
        </View>

        <View
          style={[
            styles.stockBadge,
            {
              backgroundColor:
                product.stock > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            },
          ]}
        >
          <Ionicons
            name={product.stock > 0 ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={product.stock > 0 ? '#22C55E' : '#EF4444'}
          />
          <ThemedText
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: product.stock > 0 ? '#22C55E' : '#EF4444',
            }}
          >
            {product.stock > 0
              ? `${t('in_stock')} · ${product.stock} ${t('items')}`
              : t('out_of_stock')}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          {t('about_product')}
        </ThemedText>
        <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
          {product.description}
        </ThemedText>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          {t('specifications')}
        </ThemedText>
        <View style={styles.specRow}>
          <ThemedText style={[styles.specLabel, { color: colors.textSecondary }]}>
            {t('brand')}
          </ThemedText>
          <ThemedText style={[styles.specValue, { color: colors.text }]}>
            {product.brand || '—'}
          </ThemedText>
        </View>
        <View style={[styles.specDivider, { backgroundColor: colors.border }]} />
        <View style={styles.specRow}>
          <ThemedText style={[styles.specLabel, { color: colors.textSecondary }]}>
            {t('category')}
          </ThemedText>
          <ThemedText style={[styles.specValue, { color: colors.text }]}>
            {product.category}
          </ThemedText>
        </View>
        <View style={[styles.specDivider, { backgroundColor: colors.border }]} />
        <View style={styles.specRow}>
          <ThemedText style={[styles.specLabel, { color: colors.textSecondary }]}>
            {t('stock')}
          </ThemedText>
          <ThemedText style={[styles.specValue, { color: colors.text }]}>
            {product.stock} {t('items')}
          </ThemedText>
        </View>
        <View style={[styles.specDivider, { backgroundColor: colors.border }]} />
        <View style={styles.specRow}>
          <ThemedText style={[styles.specLabel, { color: colors.textSecondary }]}>
            {t('rating')}
          </ThemedText>
          <ThemedText style={[styles.specValue, { color: colors.text }]}>
            {product.rating.toFixed(1)} / 5
          </ThemedText>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  discountText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  thumbnailRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  thumbnailBtn: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
  },
  oldPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  specLabel: {
    fontSize: 14,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  specDivider: {
    height: 1,
  },
});
