import { useState, useEffect, useRef, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import base64 from 'react-native-base64';
import { BleManager } from 'react-native-ble-plx';
import { useDataDispatch } from './DataContext';
import { decodePID } from './Decoder';

const BLEManager = new BleManager();

const SERVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
const CHARACTERISTIC_UUID = '0000FFE1-0000-1000-8000-00805F9B34FB';

export default function useBLE() {
    const [connectedDevice, setConnectedDevice] = useState();
    const [request, setRequest] = useState([]);
    const [response, setResponse] = useState([]);

    const [status, setStatus] = useState('waiting');

    let isConnected = status === 'connected';
    let isLoading = status === 'loading';

    const [adapterState, setAdapterState] = useState();
    const [subscriptions, setSubscriptions] = useState([]);
    const connectionSubscription = useRef();

    const dispatch = useDataDispatch();

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

    async function scanDevices() {
        console.log('Scanning for device');
        setStatus('loading');

        BLEManager.startDeviceScan(null, null, (error, scannedDevice) => {
            if (error) {
                console.warn(error);
            }

            if (scannedDevice && scannedDevice.name == 'OBD-BLE') {
                stopScan();
                connectToDevice(scannedDevice);
            }
        });
    }

    function stopScan() {
        console.log('Stopping scan');
        BLEManager.stopDeviceScan();
        setStatus('waiting');
    }

    //Connect the device and start monitoring characteristics
    async function connectToDevice(device) {
        console.log('Connecting to device:', device.name);

        try {
            const deviceConnection = await BLEManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            setStatus('connected');
            await deviceConnection.discoverAllServicesAndCharacteristics();
            connectionSubscription.current = deviceConnection.onDisconnected(handleOnDisconnected);
            monitorCharacteristic(deviceConnection);
        } catch (err) {
            console.log('Failed to connect', err);
        }
    }

    async function disconnectFromDevice() {
        if (connectedDevice) {
            const isDeviceConnected = await connectedDevice.isConnected();

            connectionSubscription.current?.remove();
            connectionSubscription.current = null;

            if (isDeviceConnected) {
                await connectedDevice.cancelConnection();
                setStatus('waiting');
                console.log('Disconnected from device');
            } else {
                console.log('Disconnect failed: No device connected');
                setStatus('waiting');
            }
        } else {
            console.log('Disconnect failed: Device is undefined');
        }
    }

    function handleOnDisconnected() {
        console.log('Disconnected: Connection lost!');
        connectionSubscription.current?.remove();
        connectionSubscription.current = null;
        setStatus('waiting');
    }

    async function monitorCharacteristic(device) {
        if (device) {
            device.monitorCharacteristicForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                (error, characteristic) => onCharacteristicUpdate(error, characteristic),
            );
        } else {
            console.log('No device connected');
        }
    }

    function onCharacteristicUpdate(error, characteristic) {
        // if (error) {
        //     console.log(error);
        // } else if (characteristic?.value != null) {
        //     console.log('No data received!');
        // }
        if (characteristic?.value != null) {
            const rawData = base64.decode(characteristic.value);
            setResponse(rawData);

            const response = decodePID(rawData);
            dispatch({
                type: 'changed',
                description: response?.description,
                unit: response?.unit,
            });
            dispatch({
                type: 'added',
                value: response?.value,
            });
            // console.log('Response received: ', rawData);
        }
    }

    const writeToCharacteristic = useCallback(
        async (messages) => {
            try {
                for (const message of messages) {
                    await BLEManager.writeCharacteristicWithResponseForDevice(
                        connectedDevice?.id,
                        SERVICE_UUID,
                        CHARACTERISTIC_UUID,
                        base64.encode(message + '\n'),
                    );
                }
            } catch (err) {
                console.log(err);
            }
        },
        [connectedDevice?.id],
    );

    // Bluetooth adapter state
    useEffect(() => {
        const subscription = BLEManager.onStateChange((state) => {
            setAdapterState(state);
            setSubscriptions((prevState) => [...prevState, subscription]);
        }, true);
        return () => {
            subscriptions.map((_subscription) => {
                _subscription?.remove();
                return true;
            });
            setSubscriptions([]);
        };
    }, []);

    // Get permissions on hook mount and disconnect from device when unmounted
    useEffect(() => {
        requestPermissions();
        return () => {
            disconnectFromDevice();
        };
    }, []);

    // Handle requests
    useEffect(() => {
        // TODO handle individual insertion and removal of requests
        writeToCharacteristic(request);
    }, [request, writeToCharacteristic]);

    return {
        bleState: {
            connectedDevice,
            adapterState,
            request,
            response,
            status,
            isConnected,
            isLoading,
        },
        scanDevices,
        stopScan,
        disconnectFromDevice,
        writeToCharacteristic,
        setRequest,
    };
}
