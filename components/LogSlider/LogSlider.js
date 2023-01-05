import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

function createLogScaleValues() {
    const product = (...a) => a.reduce((a, b) => a.flatMap((d) => b.map((e) => d * e)));

    const logarithmic = [1e1, 1e2, 1e3];
    const multiplier = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const logValues = product(logarithmic, multiplier);
    logValues.push(10000);
    return logValues;
}


function findClosestIndex(value, array) {
    let closestValue = array.reduce((previous, current) =>
        Math.abs(current - value) < Math.abs(previous - value) ? current : previous,
    );
    return array.indexOf(closestValue);
}

export default function LogSlider({ value, onValueChange, min, max }) {
    const theme = useTheme();
    const values = createLogScaleValues();
    const [initialValue, setInitialValue] = useState(() => findClosestIndex(value, values));

    return (
        <View style={{ alignItems: 'center' }}>
            <Slider
                style={{ width: '90%', height: 40 }}
                minimumValue={0}
                maximumValue={values.length - 1}
                value={initialValue}
                onValueChange={(i) => onValueChange(values[i])}
                step={1}
                thumbTintColor={theme.colors.primary}
            />
            <Text>{value} ms</Text>
        </View>
    );
}

//TODO: Add labels,
