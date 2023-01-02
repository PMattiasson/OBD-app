/* eslint-disable react-native/no-raw-text */
import { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import useBluetooth from '../hooks/useBluetooth';
import { Button, List, Card, useTheme, Text } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../styles/styles';
import { useBluetoothState } from '../context/BluetoothContext';
import { useSettings } from '../context/SettingsContext';
import ThemeContext from '../context/ThemeContext';

export default function BluetoothScreen() {
    const { toggleConnection, request, setRequest, response, write } = useBluetooth();

    const { state } = useBluetoothState();
    const settings = useSettings();
    const theme = useTheme();
    const { isThemeDark } = useContext(ThemeContext);

    // Connect button
    const [buttonIcon, setButtonIcon] = useState('bluetooth');
    const [buttonText, setButtonText] = useState('Connect');
    const [buttonColor, setButtonColor] = useState(theme.colors.primary);

    // Dropdown menu
    const [showDropDown, setShowDropDown] = useState(false);
    const [items, setItems] = useState([
        { label: 'OBD-II request messages', value: 'obd' },
        { label: '1F - Run time since engine start', value: '02011F', parent: 'obd' },
        { label: '11 - Throttle position', value: '020111', parent: 'obd' },
        { label: '10 - Mass air flow rate', value: '020110', parent: 'obd' },
        { label: '0F - Intake air temperature', value: '02010F', parent: 'obd' },
        { label: '0D - Vehicle speed', value: '02010D', parent: 'obd' },
        { label: '0C - Engine speed', value: '02010C', parent: 'obd' },
        { label: '0A - Fuel pressure', value: '02010A', parent: 'obd' },
        { label: '05 - Coolant temperature', value: '020105', parent: 'obd' },
        { label: '04 - Calculated engine load', value: '020104', parent: 'obd' },
        { label: 'Custom messages', value: 'custom' },
        { label: 'Clear all requests', value: 'CMD+STOP', parent: 'custom' },
    ]);

    useEffect(() => {
        if (state.connection) {
            setButtonText('Connected');
            setButtonIcon('bluetooth-connect');
            setButtonColor('limegreen');
        } else if (state.loading) {
            setButtonText('Connecting...');
            setButtonColor('orange');
        } else if (state.discovering) {
            setButtonText('Scanning');
            setButtonIcon('refresh');
        } else if (state.bluetoothEnabled) {
            setButtonText('Connect');
            setButtonIcon('bluetooth');
            setButtonColor(theme.colors.primary);
        } else {
            setButtonText('Bluetooth disabled');
            setButtonIcon('bluetooth-off');
            setButtonColor('red');
        }
    }, [
        state.connection,
        state.discovering,
        state.bluetoothEnabled,
        state.loading,
        theme.colors.primary,
    ]);

    // Auto-connect
    useEffect(() => {
        if (settings.bluetooth.autoConnect && state.device) {
            toggleConnection();
        }
    }, []);

    // Send updated command variables to device on connection or settings state update
    useEffect(() => {
        const msgUpdateFreq = `CMD+RATE?${settings.bluetooth.updateFrequency}`;
        const msgProtocol = `CMD+PROTOCOL?${settings.bluetooth.protocol ? '1' : '0'}`;
        if (state.connection) {
            write([msgUpdateFreq, msgProtocol]);
        }
    }, [state.connection, settings.bluetooth.updateFrequency, settings.bluetooth.protocol, write]);

    return (
        <View style={[styles.container.center, { justifyContent: 'flex-start' }]}>
            <Button
                style={[styles.button.primary, { backgroundColor: buttonColor }]}
                mode={'contained'}
                icon={buttonIcon}
                onPress={toggleConnection}
                disabled={!state.bluetoothEnabled || !state.device}
                loading={state.loading}
            >
                {buttonText}
            </Button>

            <DropDownPicker
                containerStyle={{ marginVertical: 20 }}
                searchPlaceholder={'Search or add custom command'}
                placeholder="Select request message"
                open={showDropDown}
                value={request}
                items={items}
                setOpen={setShowDropDown}
                setValue={setRequest}
                setItems={setItems}
                searchable={true}
                categorySelectable={false}
                // disabled={!state.connection}
                disabledStyle={{ opacity: 0.3 }}
                addCustomItem={true}
                closeOnBackPressed={true}
                listMode="SCROLLVIEW"
                scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
                listParentLabelStyle={{ fontWeight: 'bold' }}
                stickyHeader={true}
                multiple={true}
                maxHeight={300}
                theme={isThemeDark ? 'DARK' : 'LIGHT'}
            />

            <View style={styles.item.row}>
                <Card style={styles.card.ble}>
                    <Card.Content>
                        <Text variant="titleLarge">Raw OBD-II frame messages</Text>
                        <List.Accordion
                            title="Sent request messages"
                            left={(props) => <List.Icon {...props} icon="send" />}
                        >
                            {request.map((item, index) => (
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
                            {response.map((item, index) => (
                                <List.Item title={item} key={index} />
                            ))}
                        </List.Accordion>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
}
