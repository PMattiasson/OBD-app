import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, List } from 'react-native-paper';
import useBluetooth from '../hooks/useBluetooth';
import { styles } from '../styles/styles';
import { useBluetoothState } from '../context/BluetoothContext';
import { useSettingsDispatch } from '../context/SettingsContext';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

export default function DeviceScreen() {
    const { toggleDiscovery, setDevice, updateBondedDevices } = useBluetooth();
    const { state } = useBluetoothState();
    const settingsDispatch = useSettingsDispatch();

    const pairedDevices = state.devices.filter((d) => {
        return d.bonded === true;
    });
    const discoveredDevices = state.devices.filter((d) => {
        return d.bonded === false;
    });

    async function handlePress(device) {
        if (device.bonded === true) {
            if (state.device !== device) setDevice(device);
            settingsDispatch({
                type: 'SET',
                object: 'bluetooth',
                property: 'deviceName',
                value: device.name,
            });
        } else {
            await RNBluetoothClassic.pairDevice(device.address);
            await updateBondedDevices();
            console.log('Device paired:', device.name);
        }
    }

    return (
        <View style={[styles.container.center, { justifyContent: 'flex-start' }]}>
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

            <ScrollView style={{ width: '100%' }}>
                <List.Section>
                    <List.Subheader>Paired devices</List.Subheader>
                    {pairedDevices.length > 0 &&
                        pairedDevices.map((device, index) => (
                            <List.Item
                                left={(props) => (
                                    <List.Icon
                                        {...props}
                                        icon="bluetooth"
                                        color={device === state.device ? 'limegreen' : undefined}
                                    />
                                )}
                                title={device.name}
                                description={device.address}
                                key={index}
                                onPress={() => handlePress(device)}
                            />
                        ))}

                    {discoveredDevices.length > 0 && (
                        <>
                            <Divider />
                            <List.Subheader>Discovered devices</List.Subheader>
                            {discoveredDevices.map((device, index) => (
                                <List.Item
                                    left={(props) => <List.Icon {...props} icon="bluetooth" />}
                                    title={device.name}
                                    description={device.address}
                                    key={index}
                                    onPress={() => handlePress(device)}
                                />
                            ))}
                        </>
                    )}
                </List.Section>
            </ScrollView>
        </View>
    );
}
