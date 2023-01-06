import { useState } from 'react';
import { Button, Dialog, RadioButton } from 'react-native-paper';
import { useSettings, useSettingsDispatch } from '../../../context/SettingsContext';
import LogSlider from '../../LogSlider';

export default function SamplingFrequency({ visible, hideDialog }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();

    const [value, setValue] = useState(settings.bluetooth.updateFrequency);

    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title style={{fontSize: 20}}>Sampling interval</Dialog.Title>

            <Dialog.Content>
                <RadioButton.Group
                    onValueChange={(val) => setValue(val)}
                    value={value}
                >
                    <RadioButton.Item label="1000 ms" value={1000} />
                    <RadioButton.Item label="500 ms" value={500} />
                    <RadioButton.Item label="200 ms" value={200} />
                    <RadioButton.Item label="100 ms" value={100} />
                    <RadioButton.Item label="50 ms" value={50} />
                </RadioButton.Group>

                <LogSlider value={value} onValueChange={setValue} min={50} max={300000} />
            </Dialog.Content>
            
            <Dialog.Actions>
                <Button onPress={hideDialog} >Cancel</Button>

                <Button 
                    onPress={() => {
                        dispatch({type: 'SET', object: 'bluetooth', property: 'updateFrequency', value: value})
                        hideDialog();
                    }}
                >Confirm</Button>
            </Dialog.Actions>
        </Dialog>
    );
}