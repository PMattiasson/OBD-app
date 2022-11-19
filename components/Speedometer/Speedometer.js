// Inspired by https://www.lahteenlahti.com/creating-a-clock-face-in-react-native-with-svg/

import { View, Text } from 'react-native';
import SpeedIndicator from './Indicator';
import Ticks from './Ticks';
import { windowWidth as width } from '../../theme/styles';

export default function Speedometer({ speedKPH, label, unit }) {
    // General component variables
    const height = width / 2 + width * Math.sin((6 * Math.PI) / 180);
    const radius = (width * 0.9) / 2;
    const center = width / 2;

    // Tick variables
    const maxSpeed = 260;
    const angleRange = 200;
    const angleOffset = -10;

    const speedInDegrees = (speedKPH * angleRange) / maxSpeed;

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
            />
            <SpeedIndicator
                angle={speedInDegrees}
                angleOffset={angleOffset}
                width={width}
                radius={radius}
                center={center}
            />
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{speedKPH}</Text>
            </View>
        </View>
    );
}
