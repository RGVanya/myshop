import { StyleSheet, Switch, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppTheme } from '@/hooks/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const { theme, toggleTheme } = useAppTheme();
    const { t, i18n } = useTranslation();

    const changeLanguage = async (lang: string) => {
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem('user-language', lang);
    };

    return (
        <ThemedView style={{ flex: 1 }}>

            <ScrollView contentContainerStyle={styles.container}>

                <ThemedText type="title">DEBUG: {i18n.language}</ThemedText>

                {/* БЛОК ТЕМЫ */}
                <View style={styles.section}>
                    <ThemedText type="subtitle">{t('dark_mode')}</ThemedText>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                    />
                </View>

                {/* БЛОК ЯЗЫКА */}
                <View style={styles.sectionVertical}>
                    <ThemedText type="subtitle">{t('language')}</ThemedText>

                    <View style={styles.langRow}>
                        <TouchableOpacity
                            style={[styles.langButton, i18n.language.includes('ru') && styles.activeLang]}
                            onPress={() => changeLanguage('ru')}
                        >
                            <ThemedText>🇷🇺 RU</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.langButton, i18n.language.includes('en') && styles.activeLang]}
                            onPress={() => changeLanguage('en')}
                        >
                            <ThemedText>🇺🇸 EN</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(150,150,150,0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20
    },
    sectionVertical: {
        backgroundColor: 'rgba(150,150,150,0.1)',
        padding: 15,
        borderRadius: 10,
    },
    langRow: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 15
    },
    langButton: {
        flex: 1,
        padding: 15,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)'
    },
    activeLang: {
        borderColor: '#0a7ea4',
        backgroundColor: 'rgba(10, 126, 164, 0.2)'
    }
});