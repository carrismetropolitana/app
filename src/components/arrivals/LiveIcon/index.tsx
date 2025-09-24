/* * */

import { useSystemVariables } from '@/theme/global';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface LiveIconProps {
	status?: 'active' | 'inactive'
}

/* * */

export function LiveIcon({ status = 'active' }: LiveIconProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const scale = useRef(new Animated.Value(0));
	const opacity = useRef(new Animated.Value(1));

	//
	// B. Render components

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.parallel([
					Animated.timing(scale.current, {
						duration: 1750, // matches 70% of 2500ms
						toValue: 1,
						useNativeDriver: true,
					}),
					Animated.timing(opacity.current, {
						duration: 1750,
						toValue: 0,
						useNativeDriver: true,
					}),
				]),
				Animated.delay(750), // completes the 2500ms cycle
				Animated.parallel([
					Animated.timing(scale.current, {
						duration: 0,
						toValue: 0,
						useNativeDriver: true,
					}),
					Animated.timing(opacity.current, {
						duration: 0,
						toValue: 1,
						useNativeDriver: true,
					}),
				]),
			]),
		);
		animation.start();
		return () => animation.stop();
	}, [scale, opacity]);

	//
	// B. Render components

	if (status === 'inactive') {
		return (
			<View style={styles.container}>
				<View style={[styles.ripple, {
					backgroundColor: systemVariables.text[300],
					opacity: 0.5,
				}]}
				/>
				<View style={[styles.dot, { backgroundColor: systemVariables.text[300] }]} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.ripple, {
				backgroundColor: systemVariables.status.live,
				opacity: opacity.current,
				transform: [{ scale: scale.current }],
			}]}
			/>
			<View style={[styles.dot, {
				backgroundColor: systemVariables.status.live,
			}]}
			/>
		</View>
	);

	//
};
