/* * */

import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { styles } from './styles';

/* * */

interface Props {
	style?: ViewStyle
}

/* * */

export function NoVehicleIcon({ style }: Props) {
	//

	//
	// A. Setup Variables

	const noVehicleIconStyles = styles();
	const scale = useSharedValue(1);
	const opacity = useSharedValue(0.3);
	const animatedRippleStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));

	//
	// B. Transform Data

	useEffect(() => {
		scale.value = withRepeat(withTiming(1.3, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false);
		opacity.value = withRepeat(withTiming(0, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false);
	}, []);

	//
	// C. Render Components
	return (
		<View style={[noVehicleIconStyles.container, style && style]}>
			<Animated.View style={[noVehicleIconStyles.ripple, animatedRippleStyle]} />
			<View style={noVehicleIconStyles.dot} />
		</View>
	);
}
