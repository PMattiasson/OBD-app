/* eslint-disable react-native/no-raw-text */
import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import useBluetooth from '../components/useBluetooth';
import { Button, List, Card } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../styles/styles';
import { theme } from '../styles/theme';

export default function BluetoothScreen() {
    const {
        state,
        getBondedDevices,
        toggleDiscovery,
        toggleAccept,
        toggleConnection,
        setDevice,
        write,
        request,
        setRequest,
        response,
    } = useBluetooth();

    // Connect button
    const [buttonIcon, setButtonIcon] = useState('bluetooth');
    const [buttonText, setButtonText] = useState('Connect');
    const [buttonColor, setButtonColor] = useState(theme.colors.primary);

    // Dropdown menu
    const [message, setMessage] = useState('');
    const [showDropDown, setShowDropDown] = useState(false);
    const [items, setItems] = useState([
        { label: 'OBD-II request messages', value: 'obd' },
        { label: '0C - Engine speed', value: '02 01 0C', parent: 'obd' },
        { label: '0D - Vehicle speed', value: '02 01 0D', parent: 'obd' },
        { label: 'Custom messages', value: 'custom' },
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
    }, [state.connection, state.discovering, state.bluetoothEnabled, state.loading]);

    return (
        <View style={styles.container.center}>
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

            <Button
                style={styles.button.primary}
                mode={'contained'}
                icon={'magnify'}
                onPress={toggleDiscovery}
                disabled={!state.bluetoothEnabled}
                loading={state.discovering}
            >
                {!state.discovering ? 'Discover devices' : 'Discovering...'}
            </Button>

            <Card style={styles.card.ble}>
                <Card.Content>
                    <List.Accordion
                        title="Paired devices"
                        left={(props) => <List.Icon {...props} icon="devices" />}
                    >
                        <ScrollView style={{ maxHeight: 300 }}>
                            {state.devices.length > 0 &&
                                state.devices.map((device, index) => (
                                    <List.Item
                                        left={(props) =>
                                            device === state.device && (
                                                <List.Icon
                                                    {...props}
                                                    icon="check-circle"
                                                    color="limegreen"
                                                />
                                            )
                                        }
                                        title={device.name}
                                        description={device.address}
                                        key={index}
                                        onPress={() => {
                                            if (state.device == device) setDevice(undefined);
                                            else setDevice(device);
                                        }}
                                    />
                                ))}
                        </ScrollView>
                    </List.Accordion>
                </Card.Content>
            </Card>

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
                disabled={!state.connection}
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
                            <List.Item title={response} />
                        </List.Accordion>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
}
