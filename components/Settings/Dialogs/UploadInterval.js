import { useState } from 'react';
import { Button, Dialog, RadioButton } from 'react-native-paper';
import { useSettings, useSettingsDispatch } from '../../../context/SettingsContext';
// import LogSlider from '../../LogSlider';

export default function UploadInterval({ visible, hideDialog }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();

    const [value, setValue] = useState(settings.server.uploadFrequency);

    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title style={{fontSize: 20}}>Server upload interval</Dialog.Title>

            <Dialog.Content>
                <RadioButton.Group
                    onValueChange={(val) => setValue(val)}
                    value={value}
                >
                    <RadioButton.Item label="On data update" value={null} />
                    <RadioButton.Item label="1000 ms" value={1000} />
                    <RadioButton.Item label="500 ms" value={500} />
                    <RadioButton.Item label="200 ms" value={200} />
                    <RadioButton.Item label="100 ms" value={100} />
                </RadioButton.Group>
                
                {/* <LogSlider value={value} onValueChange={setValue} min={50} max={300000} /> */}
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={hideDialog} >Cancel</Button>

                <Button 
                    onPress={() => {
                        dispatch({type: 'SET', object: 'server', property: 'uploadFrequency', value: value})
                        hideDialog();
                    }}
                >Confirm</Button>
            </Dialog.Actions>
        </Dialog>
    );
}