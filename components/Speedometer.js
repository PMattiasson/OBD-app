// Inspired by https://www.lahteenlahti.com/creating-a-clock-face-in-react-native-with-svg/

import { Dimensions } from "react-native";
import { Svg, G, Line, Text, Polygon } from "react-native-svg";
// import Animated, { useSharedValue, useAnimatedProps } from 'react-native-reanimated';

export default function Speedometer({ speed }) {
    const width = Dimensions.get("window").width;
    const height = width / 2 + width * Math.sin(10 * Math.PI / 180);
    const radius = width * 0.9 / 2;
    const center = width / 2;

    const maxSpeed = 260;
    const ticksMajor = 14;
    const ticksMinor = 10 * (ticksMajor - 1);
    const angleRange = 200;
    const angleOffset = -10;

    function fromPolar(xOrigin, yOrigin, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 180) * Math.PI / 180;
        const x = xOrigin + radius * Math.cos(angleInRadians)
        const y = yOrigin + radius * Math.sin(angleInRadians)
        return {x, y};
    }

    function range(start, stop, step) {
        let result = [];
        for (var i = start; step > 0 ? i <= stop : i >= stop; i += step) {
            result.push(i);
        }
        return result;
    }

    function valueToAngle(value) {
        const angle = angleOffset + value * angleRange / maxSpeed;
        return angle;
    }

    function Needle({angle}) {
        const {x, y} = fromPolar(center, center, radius, angle);
        return (
            <Line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                strokeWidth={10}
                strokeLinecap='round'
                stroke={'red'}
            />
        );
    }

    function Ticks() {
        function MajorTicks() {
            const angleArray = range(angleOffset, angleRange + angleOffset, angleRange / (ticksMajor - 1));
            const speedArray = range(0, maxSpeed, maxSpeed / (ticksMajor - 1));

            return angleArray.map((angle, index) => {
                const start = fromPolar(center, center, radius - 20, angle);
                const end = fromPolar(center, center, radius, angle);
                const posDigit = fromPolar(center, center, radius - 40, angle);
                
                return (
                    <G key={index}>
                        <Line
                            stroke='black'
                            strokeWidth={6}
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                        />
                        <Text
                            textAnchor="middle"
                            fontSize='19'
                            fontWeight='bold'
                            fill='black'
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

        function MinorTicks({startAngle, stopAngle, stepAngle, strokeWidth, strokeLength}) {
            const angleArray = range(startAngle, stopAngle, stepAngle);

            return angleArray.map((angle, index) => {
                const start = fromPolar(center, center, radius - strokeLength, angle);
                const end = fromPolar(center, center, radius, angle);
                
                return (
                    <Line
                        stroke='black'
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
                    stepAngle={angleRange / (ticksMajor-1)}
                    strokeWidth={4}
                    strokeLength={12}
                />
                <MajorTicks/>
            </G>
        );
    }

    return (
        <Svg height={height} width={width}>
            <Ticks/>
            <Needle angle={valueToAngle(speed)}/>
        </Svg>
    );
}