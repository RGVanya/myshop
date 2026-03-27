import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors, BorderRadius } from '@/constants/theme';
import type { ElectronicsCategory } from '@/constants/theme';

interface CategoryFilterProps {
  selected: ElectronicsCategory | 'all';
  onSelect: (category: ElectronicsCategory | 'all') => void;
  categories: { key: ElectronicsCategory | 'all'; label: string }[];
}

export function CategoryFilter({ selected, onSelect, categories }: CategoryFilterProps) {
  const { theme } = useAppTheme();
  const colors = Colors[theme];

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {categories.map((cat) => {
          const isActive = cat.key === selected;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onSelect(cat.key)}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  { color: isActive ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {cat.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
