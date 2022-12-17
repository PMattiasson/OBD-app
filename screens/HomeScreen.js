import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import { styles } from '../styles/styles';
import Speedometer from '../components/Speedometer';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import WebSocketManager from '../components/WebSocketManager';
import OBDSimulator from '../components/OBDSimulator';
import DataText from '../components/DataText';

export default function DataScreen() {
    const data = useData();
    const settings = useSettings();

    return (
        <View style={styles.container.base}>
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <Card.Title
                    style={styles.card.home}
                    title="On-Board Diagnostics"
                    subtitle="Project in Embedded Systems"
                    titleVariant="titleLarge"
                    titleStyle={styles.titleText}
                    subtitleStyle={styles.baseText}
                    left={(props) => <Avatar.Icon {...props} icon="engine" />}
                />

                <WebSocketManager />
                {settings.debug.toggleSimulation && <OBDSimulator />}
            </View>

            <View style={styles.container.center}>
                <View style={styles.item.column}>
                    {Object.entries(data).map(([key, val], i) => {
                        {
                            return (
                                <DataText
                                    description={val.description}
                                    value={val.value}
                                    unit={val.unit}
                                />
                            );
                        }
                    })}
                </View>
            </View>

            <Speedometer speedKPH={data?.VehicleSpeed ? data.VehicleSpeed.value : 0} />
        </View>
    );
}
