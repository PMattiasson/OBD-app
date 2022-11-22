import { MD3LightTheme as PaperDefaultTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

// export const theme = {
//     ...PaperDefaultTheme,
//     roundness: 2,
//     version: 3,
//     colors: {
//         ...DefaultTheme.colors,
//         primary: '#3498db',
//         secondary: '#f1c40f',
//         tertiary: '#a1b2c3',
//         tabs: ['#006d6a','#1f65ff'],
//     },
// };

export const theme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        ...PaperDefaultTheme.colors,
        primary: '#3498db',
        secondary: '#f1c40f',
        tertiary: '#a1b2c3',
        tabs: ['#006d6a','#1f65ff'],
    }
};
