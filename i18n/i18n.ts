import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resources } from './translations';

const LANGUAGE_KEY = 'user-language';

const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        const savedDataJSON = await AsyncStorage.getItem(LANGUAGE_KEY);
        const lng = savedDataJSON ? savedDataJSON : 'ru'; // По умолчанию русский
        callback(lng);
    },
    init: () => { },
    cacheUserLanguage: async (lng: string) => {
        await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    }
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;