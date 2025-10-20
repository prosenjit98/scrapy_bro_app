// import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// export const lightTheme = {
//   ...MD3LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     primary: '#6200ee',
//   },
// };

// export const darkTheme = {
//   ...MD3DarkTheme,
//   colors: {
//     ...MD3DarkTheme.colors,
//     primary: '#bb86fc',
//   },
// };

import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import merge from 'deepmerge';
import { Platform } from 'react-native';
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperDefaultTheme, adaptNavigationTheme, configureFonts, useTheme } from 'react-native-paper';

const { LightTheme, DarkTheme } = adaptNavigationTheme({ reactNavigationLight: NavigationDefaultTheme, reactNavigationDark: NavigationDarkTheme });

const CombinedDefaultTheme = merge(PaperDefaultTheme, LightTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, DarkTheme);
const fonts = configureFonts({
  config: {
    fontFamily: Platform.select({
      ios: 'Outfit',
      // android: 'Outfit',
      default: 'sans-serif',
    }),
  },
});

export const theme = {
  ...CombinedDefaultTheme,
  roundness: 8,
  fonts,
  colors: {
    ...CombinedDefaultTheme.colors,
    cardShadow: '#E5FFEC',
    primary: '#4FC16E',
    primaryLight: '#EDF9F0',
    primaryDark: '369151',

    primaryBackground: '#e2e2e2',
    primaryLightBackground: '#F7F7F8',

    yellowBackground: '#FFEE5D',

    text: '#242120',
    mutedText: '#6C6C89',

    secondary: '#369151',
    secondaryLight: '#399e57',

    error: '#E9315D',
    errorLight: '#FFEFF3',

    accentLight: '#EFFFF8',

    background: '#ffffff',
    secondaryBackground: '#F8F8F8',

    caption: '#6C6C89',
    border: '1',
  },
};

export const darkTheme = {
  ...CombinedDarkTheme,
  roundness: 8,
  fonts,
  colors: {
    ...CombinedDarkTheme.colors,
    cardShadow: '#E5FFEC',
    primary: '#369151',
    onPrimary: '#fff',
    primaryLight: '#E5FFEC33',
    primaryBackground: '#161C24',
    primaryLightBackground: '#E5FFEC33',

    yellowBackground: '#f9ed7dff',

    secondary: '#28723e',
    secondaryLight: '#369151',

    text: '#E6E6E6',
    mutedText: '#6C6C89',

    error: '#E9315D',
    errorLight: '#633c45',

    accentLight: '#EFFFF8',

    background: '#000', //'#161C24',
    secondaryBackground: '#1C1C1E',

    caption: '#7E889B',
    border: '1',
  },
};

export default function getTheme(dark: boolean) {
  return dark ? darkTheme : theme;
}

export type AppTheme = typeof theme;
export const useAppTheme = () => useTheme<AppTheme>(theme);

