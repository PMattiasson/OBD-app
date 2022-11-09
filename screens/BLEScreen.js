import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { styles } from '../theme/styles';

export default function HomeScreen() {
    return (
        <View style={styles.container.center}>
            <Text>BLEScreen</Text>
        </View>
    );
}
