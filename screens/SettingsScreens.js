/* eslint-disable react-native/no-raw-text */
import { useState, useContext } from 'react';
import { ScrollView } from 'react-native';
import { Checkbox, Divider, List, Portal } from 'react-native-paper';
import { styles } from '../styles/styles';
import { useSettings, useSettingsDispatch } from '../context/SettingsContext';
import ThemeContext from '../context/ThemeContext';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import {
    DialogSamplingInterval,
    DialogServerAddress,
    DialogUploadInterval,
    DialogAccount,
} from '../components/Settings/Dialogs';
import { useDataDispatch } from '../context/DataContext';

export default function SettingsScreen({ navigation }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();
    const dispatchData = useDataDispatch();
    const { toggleTheme, isThemeDark } = useContext(ThemeContext);

    const [dialog, setDialog] = useState({ visible: false, type: null });
    const hideModal = () => setDialog({ ...dialog, visible: false });

    function ModalReference({ visible, hideDialog }) {
        const Modals = {
            DialogSamplingInterval,
            DialogServerAddress,
            DialogUploadInterval,
            DialogAccount,
        };

        let SelectedModal = Modals[dialog.type];

        return (
            dialog.type &&
            SelectedModal && <SelectedModal visible={visible} hideDialog={hideDialog} />
        );
    }

    return (
        <>
            <Portal>
                <ModalReference visible={dialog.visible} hideDialog={hideModal} />
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
                            setDialog({ visible: true, type: 'DialogSamplingInterval' });
                        }}
                    />
                    <List.Item
                        title="Save requests"
                        description="Loads last requests on startup"
                        left={(props) => <List.Icon {...props} icon="format-list-checkbox" />}
                        right={() => (
                            <Checkbox
                                status={settings.bluetooth.saveRequests ? 'checked' : 'unchecked'}
                            />
                        )}
                        onPress={() =>
                            dispatch({
                                type: 'TOGGLE',
                                object: 'bluetooth',
                                property: 'saveRequests',
                            })
                        }
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
                            setDialog({ visible: true, type: 'DialogServerAddress' });
                        }}
                    />
                    <List.Item
                        title="Upload data"
                        left={(props) => <List.Icon {...props} icon="cloud-upload-outline" />}
                        right={() => (
                            <Checkbox
                                status={settings.server.toggleUpload ? 'checked' : 'unchecked'}
                            />
                        )}
                        onPress={() => {
                            if (settings.server.apiURL || settings.server.toggleUpload) {
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
                            setDialog({ visible: true, type: 'DialogUploadInterval' });
                        }}
                    />
                    <List.Item
                        title="Account credentials"
                        left={(props) => <List.Icon {...props} icon="account" />}
                        onPress={() => {
                            setDialog({ visible: true, type: 'DialogAccount' });
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

                    <List.Subheader>Location</List.Subheader>
                    <List.Item
                        title="GPS logging"
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
                    <List.Item
                        title="Clear OBD-II response data"
                        left={(props) => <List.Icon {...props} icon="delete" />}
                        onPress={() => {
                            dispatchData({
                                type: 'reset',
                            });
                        }}
                    />
                </List.Section>
            </ScrollView>
        </>
    );
}
