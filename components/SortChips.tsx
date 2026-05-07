import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors, BorderRadius } from '@/constants/theme';

export interface SortChipOption<T extends string> {
  key: T;
  label: string;
}

interface SortChipsProps<T extends string> {
  options: SortChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SortChips<T extends string>({ options, value, onChange }: SortChipsProps<T>) {
  const { theme } = useAppTheme();
  const colors = Colors[theme];

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {options.map((opt) => {
          const selected = opt.key === value;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onChange(opt.key)}
              activeOpacity={0.85}
            >
              <ThemedText
                style={[styles.chipText, { color: selected ? '#FFF' : colors.text }]}
                numberOfLines={1}
              >
                {opt.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
