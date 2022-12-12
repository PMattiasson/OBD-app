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

    const contextValue = useMemo(() => ({ state, setState }), [state, setState]);

    return <BluetoothContext.Provider value={contextValue}>{children}</BluetoothContext.Provider>;
}
