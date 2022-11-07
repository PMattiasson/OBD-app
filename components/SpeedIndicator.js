import { useEffect } from 'react';
import { View } from 'react-native';
import { Svg, G, Line, Polygon } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, withSpring, withTiming } from 'react-native-reanimated';
import polarToCartesian from '../utils/polarToCartesian';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SpeedIndicator({angle, width, radius, center, angleOffset}) {

    const animationRotation = useSharedValue(0);

    const animationStyle = useAnimatedStyle(() => {
        const rotation = interpolate(animationRotation.value, [0, 200], [0, 200]);
        return { transform: [
            { rotate: `${rotation}deg`},
        ],
        };
    });

    // animationConfig = {};

    useEffect(() => {
        animationRotation.value = withTiming(angle, { duration: 900 });
    },[animationRotation.value, angle]);

    const {x, y} = polarToCartesian(radius, angleOffset, center, center, -180);

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