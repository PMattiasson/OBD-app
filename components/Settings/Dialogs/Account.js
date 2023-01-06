import { useState, useRef } from 'react';
import { Button, Dialog, TextInput } from 'react-native-paper';
import { useSettings, useSettingsDispatch } from '../../../context/SettingsContext';

export default function Account({ visible, hideDialog }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();

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
        hideDialog();
    }

    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title style={{ fontSize: 20 }}>Enter account credentials</Dialog.Title>

            <Dialog.Content>
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
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={hideDialog}>Cancel</Button>

                <Button onPress={handleSubmit}>Confirm</Button>
            </Dialog.Actions>
        </Dialog>
    );
}
