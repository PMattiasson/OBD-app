import { View } from 'react-native';
import { Svg, G, Line, Text } from 'react-native-svg';
import polarToCartesian from '../../utils/polarToCartesian';
import range from '../../utils/range';

const ticksMajor = 14;
const ticksMinor = 10 * (ticksMajor - 1);

export default function Ticks({
    maxSpeed,
    angleRange,
    angleOffset,
    width,
    height,
    radius,
    center,
}) {
    function MajorTicks() {
        const angleArray = range(
            angleOffset,
            angleRange + angleOffset,
            angleRange / (ticksMajor - 1),
        );
        const speedArray = range(0, maxSpeed, maxSpeed / (ticksMajor - 1));

        return angleArray.map((angle, index) => {
            const start = polarToCartesian(radius - 20, angle, center, center, -180);
            const end = polarToCartesian(radius, angle, center, center, -180);
            const posDigit = polarToCartesian(radius - 40, angle, center, center, -180);

            return (
                <G key={index}>
                    <Line
                        stroke="black"
                        strokeWidth={6}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                    />
                    <Text
                        textAnchor="middle"
                        fontSize="19"
                        fontWeight="bold"
                        fill="black"
                        alignmentBaseline="central"
                        x={posDigit.x}
                        y={posDigit.y}
                    >
                        {speedArray[index]}
                    </Text>
                </G>
            );
        });
    }

    function MinorTicks({ startAngle, stopAngle, stepAngle, strokeWidth, strokeLength }) {
        const angleArray = range(startAngle, stopAngle, stepAngle);

        return angleArray.map((angle, index) => {
            const start = polarToCartesian(radius - strokeLength, angle, center, center, -180);
            const end = polarToCartesian(radius, angle, center, center, -180);

            return (
                <Line
                    stroke="black"
                    strokeWidth={strokeWidth}
                    key={index}
                    x1={start.x}
                    x2={end.x}
                    y1={start.y}
                    y2={end.y}
                />
            );
        });
    }

    const stepSemiMinorTick = angleRange / ticksMinor;
    return (
        <View style={{ position: 'absolute' }}>
            <Svg height={height} width={width}>
                <G>
                    <MinorTicks
                        startAngle={angleOffset}
                        stopAngle={angleRange + angleOffset}
                        stepAngle={angleRange / ticksMinor}
                        strokeWidth={1}
                        strokeLength={10}
                    />
                    <MinorTicks
                        startAngle={angleOffset + 5 * stepSemiMinorTick}
                        stopAngle={angleRange + angleOffset - 5 * stepSemiMinorTick}
                        stepAngle={angleRange / (ticksMajor - 1)}
                        strokeWidth={4}
                        strokeLength={12}
                    />
                    <MajorTicks />
                </G>
            </Svg>
        </View>
    );
}
