import { memo } from 'react';
import { View } from 'react-native';
import { Svg, Line } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    withSpring,
} from 'react-native-reanimated';
import polarToCartesian from '../../utils/polarToCartesian';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SpeedIndicator({ angle, width, radius, center, angleOffset }) {
    const animationOptions = { damping: 20, mass: 1, stiffness: 200 };

    const animationRotation = useSharedValue(0);

    const animationStyle = useAnimatedStyle(() => {
        const rotation = interpolate(animationRotation.value, [0, 200], [0, 200]);
        return { transform: [{ rotate: `${rotation}deg` }] };
    });

    animationRotation.value = withSpring(angle, animationOptions);

    return (
        <AnimatedView style={animationStyle} position="absolute">
            <Indicator width={width} radius={radius} center={center} angleOffset={angleOffset} />
        </AnimatedView>
    );
}

const Indicator = memo(function Indicator({ width, radius, center, angleOffset }) {
    const { x, y } = polarToCartesian(radius, angleOffset, center, center, -180);

    return (
        <Svg height={width} width={width}>
            <Line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                origin={[center, center]}
                strokeWidth={10}
                strokeLinecap="round"
                stroke={'red'}
            />
        </Svg>
    );
});
