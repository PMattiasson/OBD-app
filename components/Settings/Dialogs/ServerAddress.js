import { useState } from 'react';
import { Button, Dialog, HelperText, TextInput } from 'react-native-paper';
import { useSettings, useSettingsDispatch } from '../../../context/SettingsContext';

export default function ServerAddress({ visible, hideDialog }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();

    const [text, setText] = useState(settings.server.apiURL);

    function handleSubmit() {
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
        hideDialog();
    }

    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title style={{ fontSize: 20 }}>Address to upload data to </Dialog.Title>

            <Dialog.Content>
                <TextInput
                    mode={'outlined'}
                    label={'Server URL'}
                    value={text}
                    onChangeText={(text) => setText(text)}
                    onSubmitEditing={handleSubmit}
                    onBlur={hideDialog}
                />

                <HelperText type="error" visible={!validURL(text)}>
                    URL is invalid!
                </HelperText>
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={hideDialog}>Cancel</Button>

                <Button onPress={handleSubmit}>Confirm</Button>
            </Dialog.Actions>
        </Dialog>
    );
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
