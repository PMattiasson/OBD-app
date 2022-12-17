import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import useBluetooth from '../hooks/useBluetooth';
import { useBluetoothState } from '../context/BluetoothContext';
import { useSettings } from '../context/SettingsContext';

export default function BluetoothManager() {
    const { disconnect, cancelDiscovery } = useBluetooth();
    const { state, setState } = useBluetoothState();
    const settings = useSettings();

    useEffect(() => {
        // On Bluetooth Manager mount
        async function init() {
            await requestPermissions();

            let paired = undefined;
            let device = undefined;
            let enabled = await RNBluetoothClassic.isBluetoothEnabled();
            if (!enabled) {
                enabled = await RNBluetoothClassic.requestBluetoothEnabled();
            }
            if (enabled) {
                paired = await RNBluetoothClassic.getBondedDevices();
                paired.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
                device = paired.find((d) => d.name === settings.bluetooth.deviceName);
            }

            setState({ ...state, bluetoothEnabled: enabled, devices: paired, device: device });
        }

        init();

        // On Bluetooth Manager unmount
        return () => {
            (async () => {
                if (state.connection) {
                    await disconnect();
                }
                if (state.discovering) {
                    await cancelDiscovery();
                }
            })();
        };
    }, []);

    // Bluetooth adapter state manager
    useEffect(() => {
        const stateSubscription = RNBluetoothClassic.onStateChanged((event) => {
            setState({ ...state, bluetoothEnabled: event.enabled });
        });
        return () => {
            stateSubscription.remove();
        };
    }, [state.bluetoothEnabled]);
}

async function requestPermissions() {
    const apiLevel = Platform.Version;

    try {
        if (apiLevel < 31) {
            const isPermissionGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            return isPermissionGranted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);

            const isPermissionGranted = Object.values(granted).every(
                (val) => val === PermissionsAndroid.RESULTS.GRANTED,
            );

            return isPermissionGranted;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}
