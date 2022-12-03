// https://kenjdavidson.com/react-native-bluetooth-classic/react-native/rn-bluetooth-classic/
// https://github.com/kenjdavidson/react-native-bluetooth-classic-apps/tree/main/BluetoothClassicExample

import { useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

export default function useBluetooth() {
    const [state, setState] = useState({
        device: undefined,
        devices: [],
        accepting: false,
        discovering: false,
        bluetoothEnabled: false,
        connection: false,
        loading: false,
        data: null,
    });
    const [data, setData] = useState();
    const connectionSubscription = useRef();
    const readSubscription = useRef();

    let toggleAccept = state.accepting ? cancelAcceptConnections : acceptConnections;

    let toggleDiscovery = state.discovering ? cancelDiscovery : startDiscovery;

    let toggleConnection = state.connection ? disconnect : connect;

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

    async function updateBondedDevices() {
        try {
            let paired = await RNBluetoothClassic.getBondedDevices();
            setState({ ...state, devices: paired });
        } catch (e) {
            console.error(e);
        }
    }

    async function startDiscovery() {
        try {
            let granted = await requestPermissions();

            if (!granted) {
                throw new Error('Permissions not granted');
            }

            setState({ ...state, discovering: true });

            let devices = [...state.devices];

            try {
                let unpaired = await RNBluetoothClassic.startDiscovery();

                let index = devices.findIndex((d) => !d.bonded);
                if (index >= 0) {
                    devices.splice(index, devices.length - index, ...unpaired);
                } else {
                    devices.push(...unpaired);
                }
                console.log(`Found ${unpaired.length} unpaired devices.`);
            } finally {
                setState({ ...state, devices: devices, discovering: false });
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function cancelDiscovery() {
        try {
            const cancelled = await RNBluetoothClassic.cancelDiscovery();
            setState({ ...state, discovering: !cancelled });
        } catch (error) {
            console.error('Error occurred while attempting to cancel discover devices');
        }
    }

    async function acceptConnections() {
        if (state.accepting) {
            console.log('Already accepting connection');
            return;
        }

        setState({ ...state, accepting: true });

        try {
            let device = await RNBluetoothClassic.accept();
            setState({ ...state, device: device });
        } catch (e) {
            console.error(e);
        } finally {
            setState({ ...state, accepting: false });
        }
    }

    async function cancelAcceptConnections() {
        if (!state.accepting) {
            return;
        }

        try {
            let cancelled = await RNBluetoothClassic.cancelAccept();
            setState({ ...state, accepting: !cancelled });
        } catch (e) {
            console.error(e);
        }
    }

    async function connect() {
        try {
            setState({ ...state, loading: true });

            let connection = await state.device.isConnected();
            if (!connection) {
                connection = await state.device.connect();
            }

            setState({ ...state, connection: connection, loading: false });

            connectionSubscription.current =
                RNBluetoothClassic.onDeviceDisconnected(onDeviceDisconnected);
            readSubscription.current = state.device.onDataReceived((data) => onDataReceived(data));
        } catch (error) {
            console.error(`Connection failed: ${error.message}`);
        }
    }

    async function disconnect() {
        try {
            const disconnected = await state.device.disconnect();
            unsubscribe();
            setState({ ...state, connection: !disconnected });
            console.log('Disconnected from device');
        } catch (error) {
            console.error(`Disconnect failed: ${error.message}`);
        }
    }

    async function onDeviceDisconnected() {
        unsubscribe();
        setState({ ...state, connection: false });
        console.log('Disconnected: Connection lost!');
    }

    async function onDataReceived(event) {
        console.log('Data received:', event.data);
        // setState({ ...state, data: event.data });
        setData(event.data);
    }

    function unsubscribe() {
        connectionSubscription.current?.remove();
        connectionSubscription.current = null;
        readSubscription.current?.remove();
        readSubscription.current = null;
    }

    function setDevice(device) {
        setState({ ...state, device: device });
        // console.log(state.device);
    }

    useEffect(() => {
        // On component mount
        (async () => {
            const enabled = await RNBluetoothClassic.isBluetoothEnabled();
            const paired = await RNBluetoothClassic.getBondedDevices();
            setState({ ...state, bluetoothEnabled: enabled, devices: paired });
        })();

        const stateSubscription = RNBluetoothClassic.onStateChanged((event) => {
            setState({ ...state, bluetoothEnabled: event.enabled });
        });

        // On component unmount
        return () => {
            stateSubscription.remove();

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

    return {
        state,
        updateBondedDevices,
        toggleDiscovery,
        toggleAccept,
        toggleConnection,
        setDevice,
    };
}
