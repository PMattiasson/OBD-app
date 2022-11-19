import React, { useState, useEffect } from 'react';
import { View, LogBox } from 'react-native';
import { Text, Button, Switch, Card, Snackbar } from 'react-native-paper';
import { styles } from '../theme/styles';
import { theme } from '../theme/theme';
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
        { label: '0D - Vehicle speed', value: '02 01 0D' },
        { label: '0C - Engine speed', value: '02 01 0C' },
    ]);

    // Connect button
    const [buttonIcon, setButtonIcon] = useState('bluetooth');
    const [buttonText, setButtonText] = useState('Connect');
    const [buttonColor, setButtonColor] = useState(theme.colors.primary);

    // Snackbar
    const [visible, setVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

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
            setSnackbarText(`Disconnected from ${bleState.connectedDevice?.name}`);
            onToggleSnackBar();
            disconnectFromDevice();
        } else if (bleState.isLoading) {
            stopScan();
            setSnackbarText('Stopped scanning for devices');
            onToggleSnackBar();
        } else {
            scanDevices();
        }
    }

    useEffect(() => {
        if (bleState.isConnected) {
            setButtonText('Connected');
            setButtonIcon('bluetooth-connect');
            setSnackbarText(`Successfully connected to ${bleState.connectedDevice?.name}`);
            onToggleSnackBar();
            setButtonColor('limegreen');
        } else if (bleState.isLoading) {
            setButtonText('Scanning');
            setButtonIcon('refresh');
        } else {
            switch (bleState.adapterState) {
            case 'PoweredOff':
                setButtonText('Bluetooth disabled');
                setButtonIcon('bluetooth-off');
                setButtonColor('red');
                break;
            case 'PoweredOn':
                setButtonText('Connect');
                setButtonIcon('bluetooth');
                setButtonColor(theme.colors.primary);
                break;
            default:
                setButtonText(bleState.adapterState);
                setButtonIcon('bluetooth-off');
            }
        }
    }, [bleState.adapterState, bleState.isConnected, bleState.isLoading]);

    return (
        <View style={styles.container.center}>
            <Snackbar
                wrapperStyle={{ top: 0 }}
                style={styles.container.snackbar}
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={3000}
            >
                <Text style={{ textAlign: 'center' }}>{snackbarText}</Text>
            </Snackbar>

            <Text style={styles.text.title}>Connect to the OBD reader</Text>

            <ConnectButton style={[styles.button.primary, { backgroundColor: buttonColor }]} />

            <DropDownPicker
                containerStyle={{ marginVertical: 20 }}
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

            <View style={styles.item.row}>
                <Card style={styles.card.card}>
                    <Card.Content>
                        <Text style={styles.text.base}>Sent request: {bleState.request}</Text>
                        <Text style={styles.text.base}>Received response: {bleState.response}</Text>
                    </Card.Content>
                </Card>
            </View>

            <Text style={styles.text.base}>BLE status: {bleState.status}</Text>
        </View>
    );
}
