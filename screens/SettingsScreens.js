/* eslint-disable react-native/no-raw-text */
import { useState, useContext, useRef } from 'react';
import { ScrollView } from 'react-native';
import {
    Button,
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
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

export default function SettingsScreen({ navigation }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();
    const { toggleTheme, isThemeDark } = useContext(ThemeContext);
    const theme = useTheme();

    const [modal, setModal] = useState({ visible: false, type: null });
    // const showModal = () => setModal({ ...modal, visible: true });
    const hideModal = () => setModal({ ...modal, visible: false });
    const containerStyle = {
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 5,
    };
    const modalStyle = { padding: 20 };

    function ModalReference() {
        const Modals = {
            ModalUpdateFrequency,
            ModalAddress,
            ModalUploadFrequency,
            ModalSignIn,
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
                style={modalStyle}
            >
                <Text variant="titleMedium">Bluetooth update interval</Text>
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
                    <RadioButton.Item label="1000 ms" value={1000} />
                    <RadioButton.Item label="200 ms" value={200} />
                    <RadioButton.Item label="100 ms" value={100} />
                    <RadioButton.Item label="50 ms" value={50} />
                </RadioButton.Group>
            </Modal>
        );
    }

    function ModalAddress() {
        const [text, setText] = useState(settings.server.apiURL);

        function handleSubmit() {
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
                '^(http?:\\/\\/)?' + // protocol
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
                style={modalStyle}
            >
                <Text variant="titleMedium">Address to upload data to </Text>
                <TextInput
                    style={{ marginTop: 15 }}
                    mode={'outlined'}
                    label={'Server URL'}
                    value={text}
                    onChangeText={(text) => setText(text)}
                    onSubmitEditing={handleSubmit}
                    onBlur={hideModal}
                />
                <HelperText type="error" visible={!validURL(text)}>
                    URL is invalid!
                </HelperText>
            </Modal>
        );
    }

    function ModalUploadFrequency() {
        return (
            <Modal
                visible={modal.visible}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}
                style={modalStyle}
            >
                <Text variant="titleMedium">Server upload interval</Text>
                <RadioButton.Group
                    onValueChange={(value) => {
                        hideModal();
                        dispatch({
                            type: 'SET',
                            object: 'server',
                            property: 'uploadFrequency',
                            value: value,
                        });
                    }}
                    value={settings.server.uploadFrequency}
                >
                    <RadioButton.Item label="On data update" value={null} />
                    <RadioButton.Item label="1000 ms" value={1000} />
                    <RadioButton.Item label="500 ms" value={500} />
                    <RadioButton.Item label="200 ms" value={200} />
                    <RadioButton.Item label="100 ms" value={100} />
                </RadioButton.Group>
            </Modal>
        );
    }

    function ModalSignIn() {
        const [username, setUsername] = useState(settings.server.username);
        const [password, setPassword] = useState(settings.server.password);
        const refPasswordInput = useRef();

        function handleSubmit() {
            dispatch({
                type: 'SET',
                object: 'server',
                property: 'username',
                value: username,
            });
            dispatch({
                type: 'SET',
                object: 'server',
                property: 'password',
                value: password,
            });
            hideModal();
        }

        return (
            <Modal
                visible={modal.visible}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}
                style={modalStyle}
            >
                <Text variant="titleMedium">Enter server account credentials</Text>
                <TextInput
                    style={{ marginTop: 15 }}
                    mode={'outlined'}
                    label={'Username'}
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    returnKeyType={'next'}
                    onSubmitEditing={() => refPasswordInput.current.focus()}
                    blurOnSubmit={false}
                    autoCapitalize={'none'}
                />
                <TextInput
                    ref={refPasswordInput}
                    style={{ marginTop: 15 }}
                    mode={'outlined'}
                    label={'Password'}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    onSubmitEditing={handleSubmit}
                    secureTextEntry={true}
                />
                <Button style={{ marginTop: 20 }} onPress={handleSubmit} mode="contained">
                    Confirm
                </Button>
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
                        right={() => (
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
                        title="Sampling interval"
                        description={
                            settings.bluetooth.updateFrequency
                                ? `${settings.bluetooth.updateFrequency} ms`
                                : 'Not defined'
                        }
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
                        right={() => (
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
                        title="Server address"
                        description={settings.server.apiURL ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="link" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'ModalAddress' });
                        }}
                    />
                    <List.Item
                        title="Toggle upload"
                        left={(props) => <List.Icon {...props} icon="cloud-upload-outline" />}
                        right={() => (
                            <Checkbox
                                status={settings.server.toggleUpload ? 'checked' : 'unchecked'}
                            />
                        )}
                        onPress={() => {
                            if (settings.server.apiURL) {
                                dispatch({
                                    type: 'TOGGLE',
                                    object: 'server',
                                    property: 'toggleUpload',
                                });
                            }
                        }}
                    />
                    <List.Item
                        title="Upload interval"
                        description={
                            settings.server.uploadFrequency === null
                                ? 'On data update'
                                : settings.server.uploadFrequency
                                    ? `${settings.server.uploadFrequency} ms`
                                    : 'Not defined'
                        }
                        left={(props) => <List.Icon {...props} icon="update" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'ModalUploadFrequency' });
                        }}
                    />
                    <List.Item
                        title="Account credentials"
                        left={(props) => <List.Icon {...props} icon="account" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'ModalSignIn' });
                        }}
                    />
                    {/* <List.Item
                        title="Packet size"
                        description={settings.server.packetSize ?? 'Not defined'}
                        left={(props) => <List.Icon {...props} icon="package-variant-closed" />}
                        onPress={() => {
                            setModal({ visible: true, type: 'ModalPacketSize' });
                        }}
                    /> */}

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
                        right={() => (
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

                    <List.Subheader>User interface</List.Subheader>
                    <List.Item
                        title="Dark theme"
                        left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                        right={() => (
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
                    <List.Item
                        title="Keep screen awake"
                        left={(props) => <List.Icon {...props} icon="eye-outline" />}
                        right={() => (
                            <Checkbox status={settings.theme.keepAwake ? 'checked' : 'unchecked'} />
                        )}
                        onPress={() => {
                            settings.theme.keepAwake ? deactivateKeepAwake() : activateKeepAwake();
                            dispatch({
                                type: 'TOGGLE',
                                object: 'theme',
                                property: 'keepAwake',
                            });
                        }}
                    />

                    <Divider />

                    <List.Subheader>Debug</List.Subheader>
                    <List.Item
                        title="OBD-II adapter simulation"
                        description="Adds a slider to home screen"
                        left={(props) => <List.Icon {...props} icon="bug" />}
                        right={() => (
                            <Checkbox
                                status={settings.debug.toggleSimulation ? 'checked' : 'unchecked'}
                            />
                        )}
                        onPress={() => {
                            dispatch({
                                type: 'TOGGLE',
                                object: 'debug',
                                property: 'toggleSimulation',
                            });
                        }}
                    />
                    <List.Item
                        title="Generate random data values"
                        description="Simulates data from OBD-II adapter"
                        left={(props) => <List.Icon {...props} icon="robot" />}
                        right={() => (
                            <Checkbox
                                status={settings.debug.generateRandom ? 'checked' : 'unchecked'}
                            />
                        )}
                        onPress={() => {
                            dispatch({
                                type: 'TOGGLE',
                                object: 'debug',
                                property: 'generateRandom',
                            });
                        }}
                    />
                </List.Section>
            </ScrollView>
        </>
    );
}
