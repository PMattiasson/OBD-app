/* eslint-disable react-native/no-raw-text */
import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import useBluetooth from '../components/useBluetooth';
import { Button, List, Card } from 'react-native-paper';
import { styles } from '../styles/styles';
import { theme } from '../styles/theme';

export default function BluetoothScreen() {
    const { state, getBondedDevices, toggleDiscovery, toggleAccept, toggleConnection, setDevice } =
        useBluetooth();

    // Connect button
    const [buttonIcon, setButtonIcon] = useState('bluetooth');
    const [buttonText, setButtonText] = useState('Connect');
    const [buttonColor, setButtonColor] = useState(theme.colors.primary);

    useEffect(() => {
        if (state.connection) {
            setButtonText('Connected');
            setButtonIcon('bluetooth-connect');
            setButtonColor('limegreen');
        } else if (state.discovering) {
            setButtonText('Scanning');
            setButtonIcon('refresh');
        } else if (state.bluetoothEnabled) {
            setButtonText('Connect');
            setButtonIcon('bluetooth');
            setButtonColor(theme.colors.primary);
        } else {
            setButtonText('Bluetooth disabled');
            setButtonIcon('bluetooth-off');
            setButtonColor('red');
        }
    }, [state.connection, state.discovering, state.bluetoothEnabled]);

    return (
        <View style={styles.container.center}>
            <Button
                style={[styles.button.primary, { backgroundColor: buttonColor }]}
                mode={'contained'}
                icon={buttonIcon}
                onPress={toggleConnection}
                disabled={!state.bluetoothEnabled || !state.device}
            >
                {buttonText}
            </Button>

            <Button
                style={styles.button.primary}
                mode={'contained'}
                onPress={toggleDiscovery}
                disabled={!state.bluetoothEnabled}
                loading={state.discovering}
            >
                {!state.discovering ? 'Discover devices' : 'Discovering...'}
            </Button>

            <Card style={styles.card.ble}>
                <Card.Content>
                    <List.Accordion
                        title="Paired devices"
                        left={(props) => <List.Icon {...props} icon="devices" />}
                    >
                        <ScrollView style={{ maxHeight: 300 }}>
                            {state.devices.length > 0 &&
                                state.devices.map((device, index) => (
                                    <List.Item
                                        left={(props) =>
                                            device === state.device && (
                                                <List.Icon
                                                    {...props}
                                                    icon="check-circle"
                                                    color="limegreen"
                                                />
                                            )
                                        }
                                        title={device.name}
                                        description={device.address}
                                        key={index}
                                        onPress={() => {
                                            if (state.device == device) setDevice(undefined);
                                            else setDevice(device);
                                        }}
                                    />
                                ))}
                        </ScrollView>
                    </List.Accordion>
                </Card.Content>
            </Card>
        </View>
    );
}
