import { useEffect } from "react";
import { Dimensions, LogBox, View } from "react-native";
import { Svg, G, Line, Polygon } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SpeedIndicator({angle}) {
    
    const width = Dimensions.get("window").width;
    const radius = width * 0.9 / 2;
    const center = width / 2;
    const angleOffset = -10;

    const animationRotation = useSharedValue(0);

    const animationStyle = useAnimatedStyle(() => {
        const rotation = interpolate(animationRotation.value, [0, 200], [0, 200]);
        return { transform: [
            { rotate: `${rotation}deg`},
        ],
        };
    })

    useEffect(() => {
        animationRotation.value = withSpring(angle);
    });

    function fromPolar(xOrigin, yOrigin, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 180) * Math.PI / 180;
        const x = xOrigin + radius * Math.cos(angleInRadians)
        const y = yOrigin + radius * Math.sin(angleInRadians)
        return {x, y};
    }

    const {x, y} = fromPolar(center, center, radius, angleOffset);

    return (
        <AnimatedView
            style={animationStyle}
            position='absolute'
        >
            <Svg 
                height={width} 
                width={width}
                >
                <Line
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    origin={[center, center]}
                    strokeWidth={10}
                    strokeLinecap='round'
                    stroke={'red'}
                />
            </Svg>
        </AnimatedView>
    );
}