import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

const ThemeContext = createContext<{
    theme: ThemeType;
    toggleTheme: () => void;
    isSystem: boolean;
    setTheme: (t: ThemeType) => void;
}>({
    theme: 'light',
    toggleTheme: () => { },
    isSystem: true,
    setTheme: () => { },
});

export const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColorScheme = useSystemColorScheme() ?? 'light';
    const [theme, setThemeState] = useState<ThemeType>(systemColorScheme);

    useEffect(() => {
        AsyncStorage.getItem('user-theme').then((saved) => {
            if (saved) setThemeState(saved as ThemeType);
        });
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
        AsyncStorage.setItem('user-theme', newTheme);
    };

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isSystem: false }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);