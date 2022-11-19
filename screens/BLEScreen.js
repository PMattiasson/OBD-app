import React, { useState, useEffect } from 'react';
import { View, LogBox } from 'react-native';
import { Text, Button, Switch } from 'react-native-paper';
import { styles } from '../theme/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import useBLE from '../components/useBLE';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function BLEScreen() {
    const {
        bleState,
        scanDevices,
        stopScan,
        disconnectFromDevice,
        writeToCharacteristic,
        setRequest,
    } = useBLE();

    // Dropdown menu
    const [showDropDown, setShowDropDown] = useState(false);
    const [items, setItems] = useState([
        { label: '0D : Vehicle speed', value: '02 01 0D' },
        { label: '0C : Engine speed', value: '02 01 0C' },
    ]);

    // Connect button
    const [buttonIcon, setButtonIcon] = useState('bluetooth');
    const [buttonText, setButtonText] = useState('Connect');

    function ConnectButton({ style }) {
        return (
            <Button
                style={style}
                mode="contained"
                icon={buttonIcon}
                loading={bleState.isLoading}
                disabled={bleState.adapterState === 'PoweredOff'}
                onPress={handlePress}
            >
                {buttonText}
            </Button>
        );
    }

    function handlePress() {
        if (bleState.isConnected) {
            disconnectFromDevice();
        } else if (bleState.isLoading) {
            stopScan();
        } else {
            scanDevices();
        }
    }

    useEffect(() => {
        if (bleState.isConnected) {
            setButtonText('Connected');
            setButtonIcon('bluetooth-connect');
        } else if (bleState.isLoading) {
            setButtonText('Scanning');
            setButtonIcon('refresh');
        } else {
            switch (bleState.adapterState) {
            case 'PoweredOff':
                setButtonText('Bluetooth disabled');
                setButtonIcon('bluetooth-off');
                break;
            case 'PoweredOn':
                setButtonText('Connect');
                setButtonIcon('bluetooth');
                break;
            default:
                setButtonText(bleState.adapterState);
                setButtonIcon('bluetooth-off');
            }
        }
    }, [bleState.adapterState, bleState.isConnected, bleState.isLoading]);

    return (
        <View style={styles.container.center}>
            <Text style={styles.text.title}>BLEScreen</Text>
            <ConnectButton style={styles.button.primary} />
            <DropDownPicker
                searchable={true}
                searchPlaceholder={'Search or add custom command'}
                addCustomItem={true}
                open={showDropDown}
                value={bleState.request}
                items={items}
                placeholder="Select OBD2 request message"
                setOpen={setShowDropDown}
                setValue={setRequest}
                setItems={setItems}
                onSelectItem={(item) => {
                    bleState.isConnected && writeToCharacteristic(item.value);
                }}
            />
            <Text style={styles.text.base}>Sent request: {bleState.request}</Text>
            <Text style={styles.text.base}>Received response: {bleState.response}</Text>
            <Text style={styles.text.base}>BLE status: {bleState.status}</Text>
        </View>
    );
}
