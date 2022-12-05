import { StyleSheet, Dimensions } from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

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
    snackbar: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
});

export const itemStyles = StyleSheet.create({
    row: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    column: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
    },
    switch: {
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
});

export const cardStyles = StyleSheet.create({
    ble: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 15,
    },
    home: {
        width: '90%',
        margin: 10,
        borderWidth: 1,
        borderRadius: 15,
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
    listItem: {
        fontSize: 15,
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
    card: { ...cardStyles },
    text: { ...textStyles },
    button: { ...buttonStyles },
};
