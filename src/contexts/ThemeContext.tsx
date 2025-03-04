import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Theme } from '../types';

type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
};

const lightTheme: Theme = {
  ...MD3LightTheme,
  dark: false,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    secondary: '#625B71',
    accent: '#7F67BE',
    background: '#FFFFFF',
    surface: '#FFFBFE',
    surfaceVariant: '#F3EDF7',
    error: '#B3261E',
    success: '#146C2E',
    text: '#1C1B1F',
    onSurface: '#1C1B1F',
    disabled: '#1F1F1F',
    placeholder: '#49454F',
    backdrop: '#1C1B1F99',
    notification: '#B3261E',
  },
};

const darkTheme: Theme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 8,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    accent: '#B69DF8',
    background: '#1C1B1F',
    surface: '#141218',
    surfaceVariant: '#49454F',
    error: '#F2B8B5',
    success: '#6BD89E',
    text: '#E6E1E5',
    onSurface: '#E6E1E5',
    disabled: '#E6E1E5',
    placeholder: '#CAC4D0',
    backdrop: '#E6E1E599',
    notification: '#F2B8B5',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themePreference: 'system',
  setThemePreference: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    const isDark =
      themePreference === 'dark' ||
      (themePreference === 'system' && systemColorScheme === 'dark');

    setTheme(isDark ? darkTheme : lightTheme);
  }, [themePreference, systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, themePreference, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 