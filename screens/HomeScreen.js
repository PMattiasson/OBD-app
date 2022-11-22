import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, Button, Switch, Card, Avatar } from 'react-native-paper';
import { styles } from '../styles/styles';
import Speedometer from '../components/Speedometer';
import { useData } from '../components/DataContext';

export default function DataScreen() {
    const data = useData();
    return (
        <View style={styles.container.base}>
            <View style={{ alignItems: 'center' }}>
                <Card.Title
                    style={styles.card.home}
                    title="On-Board Diagnostics"
                    subtitle="Project in Embedded Systems"
                    titleVariant="titleLarge"
                    titleStyle={styles.titleText}
                    subtitleStyle={styles.baseText}
                    left={(props) => <Avatar.Icon {...props} icon="engine" />}
                />
            </View>
            <View style={styles.container.center}>
                <View style={styles.item.row}>
                    {data.value !== null && (
                        <Text style={styles.text.title}>
                            {data.description}: {data.value} {data.unit}
                        </Text>
                    )}
                </View>
            </View>
            <Speedometer speedKPH={data?.value} />
        </View>
    );
}
