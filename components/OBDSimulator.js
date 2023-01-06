import { useCallback, useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import { Text } from 'react-native-paper';
import { useDataDispatch } from '../context/DataContext';
import { useBluetoothState } from '../context/BluetoothContext';
import { useSettings } from '../context/SettingsContext';

const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export default function OBDSimulator() {
    const settings = useSettings();
    const dispatch = useDataDispatch();
    const { requests, setResponses } = useBluetoothState();
    const [value, setValue] = useState(0);

    // Generate random values
    useEffect(() => {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);
        }

        if (settings.debug.generateRandom) {
            const interval = setInterval(() => {
                handleValueChange(getRandomInt(0, 65535));
            }, settings.bluetooth.updateFrequency);

            return () => clearInterval(interval);
        }
    }, [
        settings.debug.generateRandom,
        settings.bluetooth.updateFrequency,
        handleValueChange,
        requests,
    ]);

    const handleValueChange = useCallback(
        (value) => {
            setValue(value);
            const valByte = Math.round(map(value, 0, 65535, 0, 255));
            let responses = [];

            requests.forEach((req) => {
                switch (req) {
                case '020104':
                    responses.push(`034104${valByte.toString(16)}`);
                    break;
                case '020105':
                    responses.push(`034105${valByte.toString(16)}`);
                    break;
                case '02010A':
                    responses.push(`03410A${valByte.toString(16)}`);
                    break;
                case '02010C':
                    responses.push(`04410C${value.toString(16)}`);
                    break;
                case '02010D':
                    responses.push(`03410D${valByte.toString(16)}`);
                    break;
                case '020110':
                    responses.push(`034110${value.toString(16)}`);
                    break;
                }
            });

            setResponses(responses);
            dispatch({
                type: 'decode',
                responses: responses,
                timestamp: Date.now(),
            });
        },
        [requests],
    );

    return (
        <>
            <Slider
                style={{ width: '80%', height: 40 }}
                minimumValue={0}
                maximumValue={65535}
                value={0}
                onValueChange={handleValueChange}
                step={1}
            />
            <Text>Value: {value}</Text>
        </>
    );
}
