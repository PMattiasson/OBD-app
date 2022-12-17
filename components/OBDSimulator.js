import { useState } from 'react';
import Slider from '@react-native-community/slider';
import { Text } from 'react-native-paper';
import { useDataDispatch } from '../context/DataContext';

const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export default function OBDSimulator() {
    const [value, setValue] = useState(0);
    const dispatch = useDataDispatch();

    return (
        <>
            <Slider
                style={{ width: '80%', height: 40 }}
                minimumValue={0}
                maximumValue={65535}
                value={0}
                onValueChange={(val) => {
                    setValue(val);
                    const valByte = Math.round(map(val, 0, 65535, 0, 255));
                    const msgSpeed = `03410D${valByte.toString(16)}`;
                    const msgEngine = `04410C${val.toString(16)}`;
                    const messages = [msgSpeed, msgEngine];
                    messages.map((msg) => {
                        dispatch({
                            type: 'decode',
                            message: msg,
                        });
                    });
                }}
                step={1}
            />
            <Text>Value: {value}</Text>
        </>
    );
}
