/* eslint-disable react-native/no-raw-text */
import { useState, useContext } from 'react';
import { ScrollView } from 'react-native';
import {
    Checkbox,
    Divider,
    HelperText,
    List,
    Modal,
    Portal,
    RadioButton,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import { styles } from '../styles/styles';
import { useSettings, useSettingsDispatch } from '../context/SettingsContext';
import ThemeContext from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();
    const { toggleTheme, isThemeDark } = useContext(ThemeContext);
    const theme = useTheme();

    const [modal, setModal] = useState({ visible: false, type: null });
    const showModal = () => setModal({ ...modal, visible: true });
    const hideModal = () => setModal({ ...modal, visible: false });
    const containerStyle = {
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 5,
    };

    function ModalReference() {
        const Modals = {
            ModalUpdateFrequency,
            ModalAddress,
            ModalPacketSize,
        };

        let SelectedModal = Modals[modal.type];

        return modal.type && SelectedModal && <SelectedModal />;
    }

    function ModalUpdateFrequency() {
        return (
            <Modal
                visible={modal.visible}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}
                style={{ padding: 20 }}
            >
                <Text variant="titleMedium">Bluetooth update frequency</Text>
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
            </Modal>
        );
    }

    function ModalAddress() {
        const [text, setText] = useState(settings.server.apiURL);

        function handleDismiss() {
            hideModal();
            let value = undefined;
            if (text?.length > 0) {
                value = text;
            }
            dispatch({
                type: 'SET',
                object: 'server',
                property: 'apiURL',
                value: value,
            });
        }

        function validURL(str) {
            var pattern = new RegExp(
                '^(ws?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$',
                'i',
            ); // fragment locator
            return !!pattern.test(str);
        }

        return (
            <Modal
                visible={modal.visible}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}
                style={{ padding: 20 }}
            >
                <Text variant="titleMedium">Address to upload data to </Text>
                <TextInput
                    style={{ marginTop: 15 }}
                    mode={'outlined'}
                    label={'WebSocket URL'}
                    value={text}
                    onChangeText={(text) => setText(text)}
                    onSubmitEditing={handleDismiss}
                    onBlur={hideModal}
                />
                <HelperText type="error" visible={!validURL(text)}>
                    URL is invalid!
                </HelperText>
            </Modal>
        );
    }

    function ModalPacketSize() {
        return (
            <Modal
                visible={modal.visible}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}
                style={{ padding: 20 }}
            >
                <Text variant="titleMedium">Packet size</Text>
                <RadioButton.Group
                    onValueChange={(value) => {
                        hideModal();
                        dispatch({
                            type: 'SET',
                            object: 'server',
                            property: 'packetSize',
                            value: value,
                        });
                    }}
                    value={settings.server.packetSize}
                >
                    <RadioButton.Item label="1" value={1} />
                    <RadioButton.Item label="2" value={2} />
                    <RadioButton.Item label="5" value={5} />
                    <RadioButton.Item label="10" value={10} />
                </RadioButton.Group>
            </Modal>
        );
    }

    return (
        <>
            <Portal>
                <ModalReference />
            </Portal>

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
                            setModal({ visible: true, type: 'ModalUpdateFrequency' });
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
                        title="WebSocket address"
                        description={settings.server.apiURL ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="link" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'ModalAddress' });
                        }}
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
                        description={settings.server.uploadFrequency ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="update" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'ModalUploadFrequency' });
                        }}
                    />
                    <List.Item
                        title="Packet size"
                        description={settings.server.packetSize ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="package-variant-closed" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'ModalPacketSize' });
                        }}
                    />

                    <Divider />

                    {/* <List.Subheader>Speedometer</List.Subheader>
                    <List.Item
                        title="Variant style"
                        description={'Not defined'}
                        left={(props) => <List.Icon {...props} icon="speedometer" />}
                    /> */}

                    <Divider />

                    <List.Subheader>Maps</List.Subheader>
                    <List.Item
                        title="Toggle GPS"
                        left={(props) => <List.Icon {...props} icon="crosshairs-gps" />}
                        right={(props) => (
                            <Checkbox status={settings.maps.toggleGPS ? 'checked' : 'unchecked'} />
                        )}
                        onPress={() =>
                            dispatch({
                                type: 'TOGGLE',
                                object: 'maps',
                                property: 'toggleGPS',
                            })
                        }
                    />

                    <Divider />

                    <List.Subheader>Theme</List.Subheader>
                    <List.Item
                        title="Dark mode"
                        left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                        right={(props) => (
                            <Checkbox status={settings.theme.darkMode ? 'checked' : 'unchecked'} />
                        )}
                        onPress={() => {
                            toggleTheme();
                            dispatch({
                                type: 'SET',
                                object: 'theme',
                                property: 'darkMode',
                                value: !isThemeDark,
                            });
                        }}
                    />
                </List.Section>
            </ScrollView>
        </>
    );
}
