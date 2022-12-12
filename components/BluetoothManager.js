import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import useBluetooth from './useBluetooth';
import { useBluetoothState } from '../context/BluetoothContext';

export default function BluetoothManager() {
    const { disconnect, cancelDiscovery } = useBluetooth();
    const { state, setState } = useBluetoothState();

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
                device = paired.find((d) => d.name === 'HC-05');
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
                PermissionsAndroid.PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ]);

            const isPermissionGranted = Object.values(granted).every(
                (val) => val === PermissionsAndroid.RESULTS.GRANTED,
            );

            return isPermissionGranted;
        }
    } catch (err) {
        console.warn(err);
    }
}
