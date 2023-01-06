import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function LogSlider({ value, onValueChange, min, max }) {
    const theme = useTheme();
    const [values, setValues] = useState(() => createLogScaleValues(min, max));
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

function createLogScaleValues(min, max) {
    const product = (...a) => a.reduce((a, b) => a.flatMap((d) => b.map((e) => d * e)));

    const multipliers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    min = precise(min);
    const expMin = getExponent(min);
    max = precise(max);
    const expMax = getExponent(max);
    const expRange = range(expMin, expMax);
    const logSpace = expRange.map((exp) => 10 ** exp);

    let values = product(logSpace, multipliers);
    values.push(max);

    const minIndex = values.indexOf(min);
    const maxIndex = values.indexOf(max);
    values = values.slice(minIndex, maxIndex + 1);

    return values;
}

function getExponent(number) {
    return Math.floor(Math.log10(number));
}

function precise(number, precision = 1) {
    return Number(number.toPrecision(precision));
}

function range(start, stop, step = 1) {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
}

function findClosestIndex(value, array) {
    let closestValue = array.reduce((previous, current) =>
        Math.abs(current - value) < Math.abs(previous - value) ? current : previous,
    );
    return array.indexOf(closestValue);
}

//TODO: Add labels,
