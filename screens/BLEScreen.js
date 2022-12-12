import React, { useState, useEffect } from 'react';
import { View, LogBox, FlatList } from 'react-native';
import { Text, Button, Switch, Card, Snackbar, List } from 'react-native-paper';
import { styles } from '../styles/styles';
import { theme } from '../styles/theme';
import DropDownPicker from 'react-native-dropdown-picker';
import useBLE from '../hooks/useBLE';

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
        { label: 'OBD-II request messages', value: 'obd' },
        { label: '0C - Engine speed', value: '02 01 0C', parent: 'obd' },
        { label: '0D - Vehicle speed', value: '02 01 0D', parent: 'obd' },
        { label: 'Custom messages', value: 'custom' },
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
            <Text style={styles.text.base}>Select a request message to send it over Bluetooth</Text>

            <ConnectButton style={[styles.button.primary, { backgroundColor: buttonColor }]} />

            <DropDownPicker
                containerStyle={{ marginVertical: 20 }}
                searchPlaceholder={'Search or add custom command'}
                placeholder="Select request message"
                open={showDropDown}
                value={bleState.request}
                items={items}
                setOpen={setShowDropDown}
                setValue={setRequest}
                setItems={setItems}
                searchable={true}
                categorySelectable={false}
                // disabled={!bleState.isConnected}
                disabledStyle={{ opacity: 0.3 }}
                addCustomItem={true}
                closeOnBackPressed={true}
                listMode="SCROLLVIEW"
                scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
                listParentLabelStyle={{ fontWeight: 'bold' }}
                stickyHeader={true}
                maxHeight={350}
                multiple={true}
                min={0}
                max={2}
            />

            <View style={styles.item.row}>
                <Card style={styles.card.ble}>
                    <Card.Content>
                        <List.Accordion
                            title="Sent request messages"
                            left={(props) => <List.Icon {...props} icon="send" />}
                        >
                            {bleState.request.map((item, index) => (
                                <List.Item title={item} key={index} />
                            ))}
                        </List.Accordion>

                        <List.Accordion
                            title="Received response messages"
                            left={(props) => (
                                <List.Icon
                                    {...props}
                                    icon="send"
                                    style={{ transform: [{ rotate: '180deg' }] }}
                                />
                            )}
                        >
                            {/* {bleState.response.map((item, index) => (
                                <List.Item title={item} key={index} />
                            ))} */}
                            <List.Item title={bleState.response} />
                        </List.Accordion>
                    </Card.Content>
                </Card>
            </View>

            <Text style={styles.text.base}>BLE status: {bleState.status}</Text>
        </View>
    );
}
