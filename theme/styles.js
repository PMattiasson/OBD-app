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
        padding: 10,
    },
    spaceBetween: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export const itemStyles = StyleSheet.create({
    row: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
});

export const textStyles = StyleSheet.create({
    base: {
        fontSize: 15,
        color: 'black',
        margin: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});

export const buttonStyles = StyleSheet.create({
    primary: {
        width: '50%',
        margin: 20,
    },
});

export const styles = {
    container: { ...containerStyles },
    item: { ...itemStyles },
    text: { ...textStyles },
    button: { ...buttonStyles },
};
