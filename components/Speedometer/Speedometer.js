// Inspired by https://www.lahteenlahti.com/creating-a-clock-face-in-react-native-with-svg/

import { View, Text } from 'react-native';
import SpeedIndicator from './Indicator';
import Ticks from './Ticks';
import { windowWidth as width } from '../../styles/styles';
import { useTheme } from 'react-native-paper';

// General component variables
const height = width / 2 + width * Math.sin((6 * Math.PI) / 180);
const radius = (width * 0.9) / 2;
const center = width / 2;

// Tick variables
const maxSpeed = 260;
const angleRange = 200;
const angleOffset = -10;

export default function Speedometer({ speedKPH }) {
    const theme = useTheme();
    const speedInDegrees = (speedKPH * angleRange) / maxSpeed;
    const styleValue = { fontSize: 20, fontWeight: 'bold', color: theme.colors.onBackground };
    const containerValue = { flex: 1, alignItems: 'center', justifyContent: 'center' };

    return (
        <View style={{ width: width, height: height }}>
            <Ticks
                maxSpeed={maxSpeed}
                angleRange={angleRange}
                angleOffset={angleOffset}
                width={width}
                height={height}
                radius={radius}
                center={center}
                theme={theme}
            />
            <SpeedIndicator
                angle={speedInDegrees}
                angleOffset={angleOffset}
                width={width}
                radius={radius}
                center={center}
            />
            <View style={containerValue}>
                <Text style={styleValue}>{speedKPH ? speedKPH : 0}</Text>
            </View>
        </View>
    );
}
