import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import {
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { CustomMD3LightTheme, CustomMD3DarkTheme } from './CustomMD3Theme';
import merge from 'deepmerge';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    light: NavigationDefaultTheme,
    dark: NavigationDarkTheme,
});

export const CombinedDefaultTheme = merge(CustomMD3LightTheme, LightTheme);
export const CombinedDarkTheme = merge(CustomMD3DarkTheme, DarkTheme);

export const MyLightTheme = {
    ...CombinedDefaultTheme,
    colors: {
        ...CombinedDefaultTheme.colors,
        primary: '#3498db',
        secondary: '#f1c40f',
        tertiary: '#a1b2c3',
    },
};

export const MyDarkTheme = {
    ...CombinedDarkTheme,
    colors: {
        ...CombinedDarkTheme.colors,
        primary: '#3498db',
        secondary: '#f1c40f',
        tertiary: '#a1b2c3',
    },
};
