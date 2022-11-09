import { StyleSheet, Dimensions } from 'react-native';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const theme = {
    ...DefaultTheme,
    roundness: 2,
    version: 3,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3498db',
        secondary: '#f1c40f',
        tertiary: '#a1b2c3',
    },
};

export const containerStyles = StyleSheet.create({
    base: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    center: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export const textStyles = StyleSheet.create({
    base: {
        fontSize: 15,
        fontFamily: 'Cochin',
        color: 'black',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});

export const styles = {
    container: { ...containerStyles },
    text: { ...textStyles },
};
