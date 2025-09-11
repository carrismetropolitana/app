/* * */

import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { styles } from './styles';

/* * */

interface Props {
	style?: ViewStyle
}

export function LiveIcon({ style }: Props) {
	//

	//
	// A. Setup variables

	const liveIconStyles = styles();
	const scale = useSharedValue(0);
	const animatedRippleStyle = useAnimatedStyle(() => ({
		opacity: interpolate(scale.value, [0, 1.3], [0.3, 0]),
		transform: [{ scale: scale.value }],
	}));

	//
	// B. Transform Data
	useEffect(() => {
		scale.value = withRepeat(withTiming(1.3, { duration: 1500, easing: Easing.out(Easing.ease) }), -1, false);
	}, []);

	//
	// C. Render Components
	return (
		<View style={[liveIconStyles.container, style && style]}>
			<Animated.View style={[liveIconStyles.ripple, animatedRippleStyle]} />
			<View style={liveIconStyles.dot} />
		</View>
	);
}
