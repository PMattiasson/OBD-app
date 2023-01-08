import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import { useTheme } from 'react-native-paper';

export default function LogSlider({ value, onValueChange, min, max }) {
    const theme = useTheme();
    const [values, setValues] = useState(() => createLogScaleValues(min, max));
    const [initialValue, setInitialValue] = useState(() => findClosestIndex(value, values));

    useEffect(() => {
        setInitialValue(findClosestIndex(value, values));
    }, [value]);

    return (
        <Slider
            style={{ width: '90%', height: 40 }}
            minimumValue={0}
            maximumValue={values.length - 1}
            value={initialValue}
            onValueChange={(i) => onValueChange(values[i])}
            step={1}
            thumbTintColor={theme.colors.primary}
            minimumTrackTintColor={theme.colors.onSurfaceVariant}
        />
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
    const closestValue = array.reduce((previous, current) =>
        Math.abs(current - value) < Math.abs(previous - value) ? current : previous,
    );
    const closestIndex = array.indexOf(closestValue);

    return closestIndex;
}
