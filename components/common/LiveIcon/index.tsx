/* * */

import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { styles } from './styles';

/* * */

interface Props {
	style?: ViewStyle
}

export function LiveIcon({ style }: Props) {
	//

	//
	// A. Setup Variables

	const liveIconStyles = styles();
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
		<View style={[liveIconStyles.container, style && style]}>
			<Animated.View style={[liveIconStyles.ripple, animatedRippleStyle]} />
			<View style={liveIconStyles.dot} />
		</View>
	);
}
