import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DataText({ description, value, unit }) {
    return (
        <View style={styles.textRow}>
            <Text variant="titleMedium">{description}</Text>
            <View style={styles.textValueUnit}>
                <Text variant="titleMedium">{value} </Text>
                <Text variant="titleMedium">{unit}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textValueUnit: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
