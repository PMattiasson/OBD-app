import { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, RadioButton, Text, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useSettings, useSettingsDispatch } from '../../../context/SettingsContext';

export default function SamplingFrequency({ visible, hideDialog }) {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();
    const theme = useTheme();

    const [value, setValue] = useState(settings.bluetooth.updateFrequency);
    const [valueSlider, setValueSlider] = useState(settings.bluetooth.updateFrequency);

    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title style={{fontSize: 20}}>Sampling interval</Dialog.Title>
            <Dialog.Content>
                <RadioButton.Group
                    onValueChange={(val) => {
                        // hideDialog();
                        setValue(val);

                    }}
                    value={value}
                >
                    <RadioButton.Item label="1000 ms" value={1000} />
                    <RadioButton.Item label="200 ms" value={200} />
                    <RadioButton.Item label="100 ms" value={100} />
                    <RadioButton.Item label="50 ms" value={50} />
                </RadioButton.Group>

                <View style={{ alignItems: 'center' }}>
                    <Slider
                        style={{ width: '90%', height: 40 }}
                        minimumValue={50}
                        maximumValue={5000}
                        value={value}
                        onValueChange={(val) => setValueSlider(val)}
                        onSlidingComplete={(val) => setValue(val)}
                        step={50}
                        thumbTintColor={theme.colors.primary}
                    />
                    <Text>{valueSlider} ms</Text>
                </View>
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