/* eslint-disable react-native/no-raw-text */
import { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Checkbox, Divider, List, Modal, Portal, RadioButton, Text } from 'react-native-paper';
import { styles } from '../styles/styles';
import { useSettings, useSettingsDispatch } from '../context/SettingsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [modal, setModal] = useState({ visible: false, type: null });
    const showModal = () => setModal({ ...modal, visible: true });
    const hideModal = () => setModal({ ...modal, visible: false });
    const containerStyle = { backgroundColor: 'white', padding: 20, borderRadius: 5 };

    const [value, setValue] = useState(1);

    function SettingsModal() {
        const SelectModal = settingModals[modal.type];
        return (
            <Portal>
                <Modal
                    visible={modal.visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}
                    style={{ padding: 20 }}
                >
                    {modal.type && <SelectModal />}
                </Modal>
            </Portal>
        );
    }

    const settingModals = {
        UpdateFrequency: BluetoothUpdateFrequencyModal,
        PacketSize: ModalContent2,
    };

    function BluetoothUpdateFrequencyModal() {
        return (
            <>
                <Text variant="titleLarge">Bluetooth update frequency</Text>
                <RadioButton.Group
                    onValueChange={(value) => {
                        hideModal();
                        dispatch({
                            type: 'SET',
                            object: 'bluetooth',
                            property: 'updateFrequency',
                            value: value,
                        });
                    }}
                    value={settings.bluetooth.updateFrequency}
                >
                    <RadioButton.Item label="1 Hz" value={1000} />
                    <RadioButton.Item label="5 Hz" value={200} />
                    <RadioButton.Item label="10 Hz" value={100} />
                    <RadioButton.Item label="20 Hz" value={50} />
                </RadioButton.Group>
            </>
        );
    }

    function ModalContent2() {
        return (
            <>
                <Text>Packet size</Text>
                <RadioButton.Group
                    onValueChange={(value) => {
                        hideModal();
                        setValue(value);
                    }}
                    value={value}
                >
                    <RadioButton.Item label="1" value={1} />
                    <RadioButton.Item label="2" value={2} />
                    <RadioButton.Item label="5" value={5} />
                    <RadioButton.Item label="10" value={10} />
                </RadioButton.Group>
            </>
        );
    }

    return (
        <>
            <SettingsModal />
            <ScrollView style={styles.container.base}>
                <List.Section>
                    <List.Subheader>OBD-II adapter</List.Subheader>
                    <List.Item
                        title="Bluetooth device"
                        description={settings.bluetooth.deviceName ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="devices" />}
                        onPress={() => navigation.navigate('Devices')}
                    />
                    <List.Item
                        title="Auto-connect"
                        left={(props) => <List.Icon {...props} icon="bluetooth-connect" />}
                        right={(props) => (
                            <Checkbox
                                status={settings.bluetooth.autoConnect ? 'checked' : 'unchecked'}
                            />
                        )}
                        onPress={() =>
                            dispatch({
                                type: 'TOGGLE',
                                object: 'bluetooth',
                                property: 'autoConnect',
                            })
                        }
                    />
                    <List.Item
                        title="Update frequency"
                        description={settings.bluetooth.updateFrequency ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="update" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'UpdateFrequency' });
                        }}
                    />
                    <List.Item
                        title="Protocol"
                        description={
                            settings.bluetooth.protocol ? 'CAN' : 'K-line' ?? 'Not defined'
                        }
                        left={(props) => <List.Icon {...props} icon="car-cog" />}
                        right={(props) => (
                            <Checkbox
                                status={settings.bluetooth.protocol ? 'checked' : 'unchecked'}
                            />
                        )}
                        onPress={() =>
                            dispatch({
                                type: 'TOGGLE',
                                object: 'bluetooth',
                                property: 'protocol',
                            })
                        }
                    />

                    <Divider />

                    <List.Subheader>Cloud Server</List.Subheader>
                    <List.Item
                        title="API address"
                        description={settings.server.apiURL ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="link" />}
                    />
                    <List.Item
                        title="Toggle upload"
                        left={(props) => <List.Icon {...props} icon="cloud-upload-outline" />}
                        right={(props) => (
                            <Checkbox
                                status={settings.server.toggleUpload ? 'checked' : 'unchecked'}
                            />
                        )}
                        onPress={() =>
                            dispatch({
                                type: 'TOGGLE',
                                object: 'server',
                                property: 'toggleUpload',
                            })
                        }
                    />
                    <List.Item
                        title="Upload frequency"
                        description={value ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="update" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'UploadFrequency' });
                        }}
                    />
                    <List.Item
                        title="Packet size"
                        description={'Not defined'}
                        left={(props) => <List.Icon {...props} icon="package-variant-closed" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'PacketSize' });
                        }}
                    />

                    <Divider />

                    <List.Subheader>Speedometer</List.Subheader>
                    <List.Item
                        title="Variant style"
                        description={'Not defined'}
                        left={(props) => <List.Icon {...props} icon="speedometer" />}
                    />

                    <Divider />

                    <List.Subheader>Maps</List.Subheader>
                    <List.Item
                        title="Toggle GPS"
                        left={(props) => <List.Icon {...props} icon="map-outline" />}
                        right={(props) => (
                            <Checkbox status={isSwitchOn ? 'checked' : 'unchecked'} />
                        )}
                        onPress={onToggleSwitch}
                    />

                    <Divider />

                    <List.Subheader>Theme</List.Subheader>
                    <List.Item
                        title="Dark mode"
                        left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                        right={(props) => (
                            <Checkbox status={isSwitchOn ? 'checked' : 'unchecked'} />
                        )}
                        onPress={onToggleSwitch}
                    />
                </List.Section>
            </ScrollView>
        </>
    );
}
