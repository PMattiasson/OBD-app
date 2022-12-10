import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Checkbox, Divider, List, Modal, Portal, RadioButton, Text } from 'react-native-paper';
import { styles } from '../styles/styles';

export default function SettingsScreen({ navigation }) {
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [value, setValue] = useState(1);
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20, borderRadius: 5 };

    function SettingsModal({ children }) {
        return (
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}
                    style={{ padding: 20 }}
                >
                    <Text>Upload frequency</Text>
                    <RadioButton.Group
                        onValueChange={(value) => {
                            hideModal();
                            setValue(value);
                        }}
                        value={value}
                    >
                        <RadioButton.Item label="1 Hz" value={1000} />
                        <RadioButton.Item label="5 Hz" value={200} />
                        <RadioButton.Item label="10 Hz" value={100} />
                        <RadioButton.Item label="20 Hz" value={50} />
                    </RadioButton.Group>
                </Modal>
            </Portal>
        );
    }

    return (
        <ScrollView style={styles.container.base}>
            <SettingsModal />

            <List.Section>
                <List.Subheader>Bluetooth</List.Subheader>
                <List.Item
                    title="Device"
                    description={'Not defined'}
                    left={(props) => <List.Icon {...props} icon="devices" />}
                    onPress={() => navigation.navigate('Devices')}
                />
                <List.Item
                    title="Auto-connect"
                    left={(props) => <List.Icon {...props} icon="bluetooth-connect" />}
                    right={(props) => <Checkbox status={isSwitchOn ? 'checked' : 'unchecked'} />}
                    onPress={onToggleSwitch}
                />
                <List.Item
                    title="Update frequency"
                    description={value ?? 'Not defined'}
                    left={(props) => <List.Icon {...props} icon="update" />}
                    onPress={showModal}
                />

                <Divider />

                <List.Subheader>Cloud Server</List.Subheader>
                <List.Item
                    title="API address"
                    description={process.env.URL ?? 'Not defined'}
                    left={(props) => <List.Icon {...props} icon="link" />}
                />
                <List.Item
                    title="Toggle upload"
                    left={(props) => <List.Icon {...props} icon="cloud-upload-outline" />}
                    right={(props) => <Checkbox status={isSwitchOn ? 'checked' : 'unchecked'} />}
                    onPress={onToggleSwitch}
                />
                <List.Item
                    title="Upload frequency"
                    description={value ?? 'Not defined'}
                    left={(props) => <List.Icon {...props} icon="update" />}
                    onPress={showModal}
                />
                <List.Item
                    title="Packet size"
                    description={'Not defined'}
                    left={(props) => <List.Icon {...props} icon="package-variant-closed" />}
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
                    right={(props) => <Checkbox status={isSwitchOn ? 'checked' : 'unchecked'} />}
                    onPress={onToggleSwitch}
                />

                <Divider />

                <List.Subheader>Theme</List.Subheader>
                <List.Item
                    title="Dark mode"
                    left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                    right={(props) => <Checkbox status={isSwitchOn ? 'checked' : 'unchecked'} />}
                    onPress={onToggleSwitch}
                />
            </List.Section>
        </ScrollView>
    );
}
