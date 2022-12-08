import { useState } from 'react';
import { View } from 'react-native';
import { Checkbox, Divider, List, Modal, Portal, RadioButton, Text } from 'react-native-paper';
import { styles } from '../styles/styles';

export default function SettingsScreen() {
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [value, setValue] = useState(1);
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20, borderRadius: 5 };

    return (
        <View style={styles.container.base}>
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
            <List.Section>
                <List.Subheader>Cloud Server</List.Subheader>
                <List.Item
                    title="Toggle upload"
                    left={(props) => <List.Icon {...props} icon="cloud-upload-outline" />}
                    right={(props) => <Checkbox status={isSwitchOn ? 'checked' : 'unchecked'} />}
                    onPress={onToggleSwitch}
                />
                <List.Item
                    title="API address"
                    description={process.env.URL ?? 'Not defined'}
                    left={(props) => <List.Icon {...props} icon="link" />}
                />
                <List.Item
                    title="Upload frequency"
                    description={value ?? 'Not defined'}
                    left={(props) => <List.Icon {...props} icon="clock-outline" />}
                    onPress={showModal}
                />
                <List.Item
                    title="Packet size"
                    description={'Not defined'}
                    left={(props) => <List.Icon {...props} icon="package-variant-closed" />}
                />
                <Divider />
                <List.Subheader>Speedometer</List.Subheader>
            </List.Section>
        </View>
    );
}
