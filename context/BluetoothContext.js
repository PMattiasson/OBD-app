import { createContext, useContext, useState, useMemo } from 'react';

const BluetoothContext = createContext(null);

export function useBluetoothState() {
    return useContext(BluetoothContext);
}

export function BluetoothProvider({ children }) {
    const [state, setState] = useState({
        device: undefined,
        devices: [],
        accepting: false,
        discovering: false,
        bluetoothEnabled: false,
        connection: false,
        loading: false,
    });
    const [requests, setRequests] = useState([]);
    const [responses, setResponses] = useState([]);

    const contextValue = useMemo(
        () => ({ state, setState, requests, setRequests, responses, setResponses }),
        [state, setState, requests, setRequests, responses, setResponses],
    );

    return <BluetoothContext.Provider value={contextValue}>{children}</BluetoothContext.Provider>;
}
