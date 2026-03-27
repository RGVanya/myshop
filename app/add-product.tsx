import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/ThemeContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { useProductFormViewModel } from '@/src/viewmodels/useProductFormViewModel';

export default function AddProductScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const colors = Colors[theme];
  const vm = useProductFormViewModel();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.imagePicker, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={vm.pickImage}
            >
              {vm.image ? (
                <Image source={{ uri: vm.image }} style={styles.previewImage} contentFit="cover" />
              ) : (
                <View style={styles.placeholderContent}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.accentLight }]}>
                    <Ionicons name="camera-outline" size={32} color={colors.accent} />
                  </View>
                  <ThemedText style={[styles.photoHint, { color: colors.textSecondary }]}>
                    {t('add_photo')}
                  </ThemedText>
                </View>
              )}
              {vm.image && (
                <View style={[styles.changePhotoBtn, { backgroundColor: colors.primary }]}>
                  <Ionicons name="camera-outline" size={16} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>

            <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, Shadows.sm]}>
              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
                  {t('name_label')} *
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]}
                  value={vm.title}
                  onChangeText={vm.setTitle}
                  placeholder={t('name_label')}
                  placeholderTextColor={colors.textSecondary}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
                  {t('desc_label')}
                </ThemedText>
                <TextInput
                  style={[styles.input, styles.multiline, { color: colors.text, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]}
                  value={vm.description}
                  onChangeText={vm.setDescription}
                  placeholder={t('desc_label')}
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
                  {t('price_label')} (₽) *
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]}
                  value={vm.price}
                  onChangeText={vm.setPrice}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                  returnKeyType="done"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }, Shadows.md]}
              onPress={() => vm.save(t)}
              disabled={vm.saving}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFF" />
              <ThemedText style={styles.saveBtnText}>{t('add_product')}</ThemedText>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  imagePicker: {
    height: 180,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContent: {
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 14,
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: BorderRadius.md,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
