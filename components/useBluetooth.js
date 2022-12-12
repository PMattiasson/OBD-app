// https://kenjdavidson.com/react-native-bluetooth-classic/react-native/rn-bluetooth-classic/
// https://github.com/kenjdavidson/react-native-bluetooth-classic-apps/tree/main/BluetoothClassicExample

import { useState, useEffect, useRef, useCallback } from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { useDataDispatch } from './DataContext';
import { useBluetoothState } from '../context/BluetoothContext';

export default function useBluetooth() {
    const { state, setState } = useBluetoothState();

    const [request, setRequest] = useState([]);
    const [response, setResponse] = useState();

    const dispatch = useDataDispatch();

    const connectionSubscription = useRef();
    const readSubscription = useRef();

    let toggleDiscovery = state.discovering ? cancelDiscovery : startDiscovery;

    let toggleConnection = state.connection ? disconnect : connect;

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

    async function connect() {
        try {
            setState({ ...state, loading: true });

            console.log('Connecting to', state.device.name);

            let connection = await state.device.isConnected();
            if (!connection) {
                connection = await state.device.connect({ DELIMITER: '\r\n' });
            }

            setState({ ...state, connection: connection, loading: false });

            connectionSubscription.current =
                RNBluetoothClassic.onDeviceDisconnected(onDeviceDisconnected);

            readSubscription.current = state.device.onDataReceived((data) => onDataReceived(data));

            console.log('Successfully connected!');
        } catch (error) {
            console.error(`Connection failed: ${error.message}`);
            setState({ ...state, loading: false });
        }
    }

    async function disconnect() {
        try {
            const disconnected = await state.device.disconnect();
            setState({ ...state, connection: !disconnected });
            console.log('Disconnected from device');
        } catch (error) {
            setState({ ...state, connection: false });
            console.error(`Disconnect failed: ${error.message}`);
        } finally {
            unsubscribe();
        }
    }

    async function onDeviceDisconnected() {
        const connection = await state.device.isConnected();
        if (!connection) {
            unsubscribe();
            setState({ ...state, connection: false });
            console.log('Disconnected: Connection lost!');
        }
    }

    async function onDataReceived(event) {
        const data = event.data;
        if (data !== null) {
            setResponse(data);

            const responses = data.split('\n');
            responses.map((res) => {
                dispatch({
                    type: 'decode',
                    message: res,
                });
            });
        }
        // console.log('Data received:', data);
    }

    const write = useCallback(
        async (messages) => {
            try {
                for (const message of messages) {
                    await state.device?.write(message + '\n');
                }
            } catch (error) {
                console.error('Could not write:', error);
            }
        },
        [state.device],
    );

    // Handle requests
    useEffect(() => {
        // TODO handle individual insertion and removal of requests
        write(request);
    }, [request, write]);

    function unsubscribe() {
        connectionSubscription.current?.remove();
        connectionSubscription.current = null;
        readSubscription.current?.remove();
        readSubscription.current = null;
    }

    function setDevice(device) {
        setState({ ...state, device: device });
    }

    return {
        updateBondedDevices,
        toggleDiscovery,
        toggleConnection,
        setDevice,
        write,
        request,
        setRequest,
        response,
    };
}
