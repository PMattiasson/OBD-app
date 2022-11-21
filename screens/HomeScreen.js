import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { styles } from '../theme/styles';
import Speedometer from '../components/Speedometer';
import { useData } from '../components/DataContext';

export default function DataScreen() {
    const data = useData();

    return (
        <View style={styles.container.base}>
            <View style={styles.container.center}>
                <View style={styles.item.row}>
                    <Text style={styles.text.title}>DataScreen</Text>
                </View>
            </View>
            <Speedometer speedKPH={data?.value} />
        </View>
    );
}
