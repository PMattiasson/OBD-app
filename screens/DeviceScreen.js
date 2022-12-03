import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, List } from 'react-native-paper';
import useBluetooth from '../components/useBluetooth';
import { styles } from '../styles/styles';

export default function DeviceScreen() {
    const { state, updateBondedDevices, toggleDiscovery, toggleConnection, setDevice } =
        useBluetooth();
    //     state.devices.map((device) => {
    //         if (device.bonded) {
    //             pairedDevices.push(device);
    //         } else {
    //             discoveredDevices.push(device);
    //         }
    //     });
    // }, [state.devices]);

    return (
        <View style={styles.container.center}>
            <Button
                style={styles.button.primary}
                mode={'contained'}
                icon={'magnify'}
                onPress={toggleDiscovery}
                disabled={!state.bluetoothEnabled}
                loading={state.discovering}
            >
                {!state.discovering ? 'Discover devices' : 'Discovering...'}
            </Button>

            <List.Section title="Paired devices" style={{ width: '100%' }}>
                <ScrollView>
                    {state.devices.length > 0 &&
                        state.devices.map((device, index) => (
                            <List.Item
                                left={(props) => (
                                    <List.Icon
                                        {...props}
                                        icon="check-circle"
                                        color={device === state.device ? 'limegreen' : undefined}
                                    />
                                )}
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
            </List.Section>
        </View>
    );
}
