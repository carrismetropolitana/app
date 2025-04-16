import { IconCaretLeft } from '@tabler/icons-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

interface AccordionToggleProps {
	expanded: boolean
	size?: number
	style?: StyleProp<ViewStyle>
}

export const AccordionToggle = ({ expanded, size = 24, style }: AccordionToggleProps) => {
	const rotateAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(rotateAnim, {
			duration: 200,
			easing: Easing.ease,
			toValue: expanded ? 1 : 0,
			useNativeDriver: true,
		}).start();
	}, [expanded, rotateAnim]);

	const rotate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '90deg'],
	});

	return (
		<Animated.View style={[{ transform: [{ rotate }] }, style]}>
			<IconCaretLeft color="#D2D2DC" fill="#D2D2DC" size={size} />
		</Animated.View>
	);
};
