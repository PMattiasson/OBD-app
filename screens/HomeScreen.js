import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { styles } from '../theme/styles';
import Speedometer from '../components/Speedometer';

export default function DataScreen() {
    return (
        <View style={styles.container.center}>
            <Text>DataScreen</Text>
            <Speedometer speedKPH={50} />
        </View>
    );
}
